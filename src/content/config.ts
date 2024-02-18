import { z, defineCollection } from 'astro:content';

const profileCollection = defineCollection({
  type: 'content',
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.date(),
    summary: z.string(),
  }),
});

export const collections = {
  'profile': profileCollection,
  'blog': blogCollection,
};