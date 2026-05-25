import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const profileCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/profile' }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = {
  'profile': profileCollection,
  'blog': blogCollection,
};
