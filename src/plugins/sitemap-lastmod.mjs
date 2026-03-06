import fs from 'fs'
import path from 'path'

/**
 * Scans content directories for pubDate/updatedDate frontmatter
 * and returns a Map of full URLs to Date objects for sitemap lastmod.
 */
export function sitemapLastmodMap(siteUrl) {
	const map = new Map()
	const contentDirs = [
		{ dir: 'src/content/blog', section: 'blog' },
		{ dir: 'src/content/art', section: 'art' },
	]

	for (const { dir, section } of contentDirs) {
		const fullDir = path.resolve(dir)
		if (!fs.existsSync(fullDir)) continue

		const files = fs
			.readdirSync(fullDir)
			.filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

		for (const file of files) {
			const filePath = path.join(fullDir, file)
			const content = fs.readFileSync(filePath, 'utf-8')
			const date = extractDate(content)
			if (date) {
				const slug = file.replace(/\.(md|mdx)$/, '')
				const url = `${siteUrl}/${section}/${slug}/`
				map.set(url, date)
			}
		}
	}

	return map
}

function extractDate(content) {
	const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
	if (!fmMatch) return null

	const fm = fmMatch[1]
	const updatedMatch = fm.match(/updatedDate:\s*['"]?(.+?)['"]?\s*$/m)
	const pubMatch = fm.match(/pubDate:\s*['"]?(.+?)['"]?\s*$/m)

	const dateStr = updatedMatch?.[1] || pubMatch?.[1]
	if (!dateStr) return null

	const parsed = new Date(dateStr)
	return isNaN(parsed.getTime()) ? null : parsed
}
