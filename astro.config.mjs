// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://kaldon.io',

  integrations: [
    sitemap(),
  ],

  output: 'static',

  build: {
    format: 'directory',
  },

  vite: {
    css: {
      postcss: './postcss.config.mjs',
    },
  },

  adapter: cloudflare(),
});