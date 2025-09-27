import { defineConfig } from '@rsbuild/core';
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";


export default defineConfig({
  plugins: [pluginNodePolyfill(), pluginReact()],
  server : {
    port: 6000
  },
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
});