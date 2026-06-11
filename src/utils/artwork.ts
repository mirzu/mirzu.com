// Artwork images are named `<title-words>__<medium>.<ext>`, e.g.
// `big-potato__lithograph.jpg` → title "Big Potato", medium "Lithograph".
// The title and medium of each piece are derived from that filename.

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'in', 'of', 'on', 'or', 'the', 'to'])

function titleCase(slug: string): string {
	return slug
		.split('-')
		.filter(Boolean)
		.map((word, index) =>
			index > 0 && SMALL_WORDS.has(word)
				? word
				: word[0].toUpperCase() + word.slice(1)
		)
		.join(' ')
}

export interface ArtworkInfo {
	title: string
	medium: string
}

/**
 * Parse title and medium from an image src. Handles both dev srcs
 * (`/@fs/.../big-potato__lithograph.jpg?origWidth=...`) and production
 * srcs with a content hash (`/_astro/big-potato__lithograph.Czxi3.jpg`).
 */
export function parseArtworkImage(src: string): ArtworkInfo {
	const filename = decodeURIComponent(src).split('?')[0].split('/').pop() ?? ''
	const [titlePart, mediumPart] = filename.split('__')
	if (!titlePart || !mediumPart) {
		throw new Error(
			`Artwork image "${src}" does not follow the <title>__<medium>.<ext> naming convention`
		)
	}
	// Medium is everything before the first dot (drops the hash and extension)
	const medium = mediumPart.split('.')[0]
	return { title: titleCase(titlePart), medium: titleCase(medium) }
}
