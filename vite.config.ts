import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createMpaPlugin } from 'vite-plugin-virtual-mpa';

const base = process.env.VITE_BASE_PATH ?? '/';
// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    createMpaPlugin({
      pages: [
        { name: 'group', entry: '/src/group-stage/main.ts' },
        { name: 'knockout', entry: '/src/knockout/main.ts' },
      ],
    }),
  ],
});
