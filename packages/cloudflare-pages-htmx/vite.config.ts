// https://vitejs.dev/guide/backend-integration.html

import { defineConfig } from 'vite';
import type {} from '@vavite/multibuild';
import preact from '@preact/preset-vite';
import remixRoutes from 'vite-plugin-remix-routes';
import path from 'path';

// pnpm vavite

// https://vitejs.dev/config/
export default defineConfig({
  buildSteps: [
    {
      name: 'client',
      config: {},
    },
    {
      name: 'server',
      config: {
        build: {
          ssr: true,
        },
      },
    },
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  build: {
    // manifest: fileURLToPath(new URL('./lib/manifest.json', import.meta.url)),
    // ssrManifest: true,
    // emptyOutDir: false, // avoid issue with wrangler
  },
  ssr: {
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'automatic',
        jsxImportSource: 'preact',
      },
    },
  },
  plugins: [
    preact(),
    remixRoutes({
      appDirectory: path.resolve('./src'),
      dataRouterCompatible: true,
    }),
    {
      name: 'app-config',
      config(config, env) {
        if (env.ssrBuild) {
          return {
            build: {
              emptyOutDir: false,
              rollupOptions: {
                input: 'src/entry-server.ts',
              },
              outDir: 'dist/server',
              copyPublicDir: false,
            },
          };
        } else {
          return {
            build: {
              emptyOutDir: false,

              outDir: 'dist/client',
              manifest: true,
              rollupOptions: {
                input: 'src/entry-client.ts',
              },
            },
          };
        }
      },
    },
  ],
});
