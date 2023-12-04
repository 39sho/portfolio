import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";
import rehypeForlink from './src/lib/rehype-forlink';

// https://astro.build/config
export default defineConfig({
  site: 'https://39sho.dev',
  integrations: [tailwind(), mdx()],
  markdown: {
    rehypePlugins: [rehypeForlink],
  },
});