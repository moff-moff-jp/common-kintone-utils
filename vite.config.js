import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/components/table/custom-table.js',
      name: 'CustomTable',
      formats: ['iife'],
      fileName: () => 'custom-table.bundle.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});