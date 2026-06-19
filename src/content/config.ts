import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			coverImageCredit: z.string().optional(),
			coverImage: image(),
		}),
})

const art = defineCollection({
	// Top-level files only — subdirectories hold the artCars and prints collections
	loader: glob({ base: './src/content/art', pattern: '*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			coverImageCredit: z.string().optional(),
			coverImage: image(),
		}),
})

const artCars = defineCollection({
	loader: glob({ base: './src/content/art/art-cars', pattern: '*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			coverImageCredit: z.string().optional(),
			coverImage: image(),
			yearCreated: z.number(),
			artMedium: z.string(),
		}),
})

const prints = defineCollection({
	loader: glob({ base: './src/content/art/printmaking', pattern: '*.{md,mdx}' }),
	// Title and medium are derived from the image filename: <title-words>__<medium>.jpg
	schema: ({ image }) =>
		z.object({
			image: image(),
			yearCreated: z.number(),
			description: z.string(),
			order: z.number().optional(),
		}),
})

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().optional(),
		description: z.string().optional(),
		// Homepage-only structured copy, rendered by src/pages/index.astro
		home: z
			.object({
				welcome: z.string(),
				brand: z.string(),
				intro: z.array(z.string()),
				aboutTitle: z.string(),
				aboutBody: z.string(),
				contactTitle: z.string(),
				contactBody: z.string(),
			})
			.optional(),
	}),
})

export const collections = { blog, art, artCars, prints, pages }
