import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
	schema: z.object({
		topic: z.string(),
		teacher: z.string(),
		day: z.string(),
		time: z.string(),
		audience: z.string().optional(),
	}),
});

const updates = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
	schema: z.object({
		date: z.coerce.date(),
		title: z.string(),
	}),
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
	schema: z.object({
		date: z.coerce.date(),
		title: z.string(),
		category: z.string().optional(),
	}),
});

const memorials = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/memorials' }),
	schema: z.object({
		name: z.string(),
		hebrewDate: z.string(),
		date: z.coerce.date(),
		contact: z.string().optional(),
	}),
});

const refuah = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/refuah' }),
	schema: z.object({
		hebrewName: z.string(),
		motherHebrewName: z.string().optional(),
	}),
});

export const collections = { lessons, updates, events, memorials, refuah };
