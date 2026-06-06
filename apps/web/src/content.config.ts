import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		canonicalUrl: z.string().optional(),
		noindex: z.boolean().optional(),
	}),
});

export const collections = { blog };
