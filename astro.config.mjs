import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import rehypeFigureTitle from 'rehype-figure-title'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs'
import { markdownExport } from './src/plugins/markdown-export.mjs'
import { sitemapLastmodMap } from './src/plugins/sitemap-lastmod.mjs'

import cloudflare from '@astrojs/cloudflare';

const lastmodMap = sitemapLastmodMap('https://www.mirzu.com')

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mirzu.com',
  base: '',

  integrations: [
      mdx(),
      sitemap({
          filter: (page) => !page.includes('/index-md'),
          serialize(item) {
              const lastmod = lastmodMap.get(item.url)
              if (lastmod) {
                  item.lastmod = lastmod
              }
              return item
          },
      }),
      icon(),
      partytown({
          config: {
              forward: ['dataLayer.push'],
          },
      }),
      markdownExport(),
	],

  vite: {
      plugins: [tailwindcss()],
	},

  markdown: {
      remarkPlugins: [remarkReadingTime, remarkModifiedTime],
      rehypePlugins: [rehypeFigureTitle, rehypeAccessibleEmojis],
	},

  adapter: cloudflare(),
})