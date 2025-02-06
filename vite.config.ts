import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';

import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

import {netlifyPlugin} from '@netlify/remix-edge-adapter/plugin';

export default defineConfig({
  server: {
    allowedHosts: [
      'cspsandbox.work',
      'localhost',
      'csp.ngrok.app',
      'comptoir-sud-pacifique.com',
    ],
  },
  plugins: [
    hydrogen(),

    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
  ssr: {
    optimizeDeps: {
      include: ['prop-types', 'typographic-base'],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      '@headlessui/react',
      'typographic-base',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    cssCodeSplit: true, // Permet de diviser le CSS en plusieurs fichiers pour éviter le blocage
    minify: 'esbuild', // Minification rapide et efficace du CSS
  },
});
