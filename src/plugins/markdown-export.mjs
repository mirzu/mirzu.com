import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Custom Astro integration that generates markdown alternatives for blog posts.
 * Outputs .md files with custom frontmatter alongside the HTML blog pages.
 */
export function markdownExport(options = {}) {
	const {
		siteUrl = 'https://mirzu.com',
		contentDir = 'src/content/blog',
		outputPath = 'blog',
	} = options

	return {
		name: 'markdown-export',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				const buildDir = fileURLToPath(dir)
				const srcDir = path.join(process.cwd(), contentDir)
				const files = fs.readdirSync(srcDir)

				console.log(`\n[markdown-export] Generating markdown files for ${files.length} items...`)

				for (const file of files) {
					const ext = path.extname(file)
					if (ext !== '.md' && ext !== '.mdx') continue

					try {
						const slug = path.basename(file, ext)
						const raw = fs.readFileSync(path.join(srcDir, file), 'utf-8')

						const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/)
						if (!fmMatch) {
							console.log(`[markdown-export] ⚠️ No frontmatter in ${file}, skipping`)
							continue
						}

						const fmBlock = fmMatch[1]
						const body = raw.slice(fmMatch[0].length).trim()

						// Extract title from frontmatter
						const titleMatch = fmBlock.match(/^title:\s*['"]?(.*?)['"]?\s*$/m)
						const title = titleMatch ? titleMatch[1] : slug

						// Extract pubDate from frontmatter
						const dateMatch = fmBlock.match(/^pubDate:\s*['"]?(.*?)['"]?\s*$/m)
						const pubDate = dateMatch ? dateMatch[1] : ''

						// Build new frontmatter
						const newFrontmatter = [
							`url: ${siteUrl}/blog/${slug}/`,
							`title: "${title}"`,
							`author:`,
							`  name: Mike Minecki`,
							`  url: ${siteUrl}/about`,
							`date: ${pubDate}`,
						].join('\n')

						// Body starts with # title, then original content
						const newBody = `# ${title}\n\n${body}`
						const output = `---\n${newFrontmatter}\n---\n\n${newBody}\n`

						const outPath = path.join(buildDir, outputPath, `${slug}.md`)
						fs.mkdirSync(path.dirname(outPath), { recursive: true })
						fs.writeFileSync(outPath, output)
						console.log(`[markdown-export] ✓ ${slug}.md`)
					} catch (err) {
						console.error(`[markdown-export] ❌ Error processing ${file}:`, err)
					}
				}

				console.log(`[markdown-export] ✓ Done`)
			},
		},
	}
}
