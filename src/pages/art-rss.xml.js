import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

export async function GET(context) {
	const art = await getCollection('art')
	return rss({
		// `<title>` field in output xml
		title: `Art - ${SITE_TITLE}`,
		// `<description>` field in output xml
		description: SITE_DESCRIPTION,
		// Pull in your project "site" from the endpoint context
		// https://docs.astro.build/en/reference/api-reference/#site
		site: context.site,
		// Array of `<item>`s in output xml
		// See "Generating items" section for examples using content collections and glob imports
		items: art.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			// Compute RSS link from post `id`
			// This example assumes all posts are rendered as `/art/[id]` routes
			link: `/art/${post.id.replace('.md', '')}/`,
		})),
	})
}
