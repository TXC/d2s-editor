import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  publicDir: './public',
  //alias: {
  //  resolve: {
  //    '~' : './node_modules',
  //  },
  //},
  build: {
    target: 'esnext',
    outDir: './dist',
    assetsInlineLimit: 8192,
    sourcemap: true,
  },
  plugins: [react()]
})
