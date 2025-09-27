import { defineConfig } from '@rsbuild/core';
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";


export default defineConfig({
  plugins: [pluginNodePolyfill(), pluginReact()],
  server : {
    host : "127.0.0.1",
    port: 9010
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