import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/components/table/custom-table.js',
      name: 'CustomTable',
      fileName: () => 'custom-table.bundle.js',
      formats: ['iife']   // 🔥 關鍵：給 kintone 用
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});