import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // 1. 進入點：指向你的入口文件
      entry: resolve(__dirname, 'src/index.js'),
      // 2. 全域變數名稱：在 Kintone 環境中可以透過 window.CustomTable 存取
      name: 'CustomTable',
      // 3. 輸出格式：使用 UMD，這在 Kintone 中相容性最強
      formats: ['umd'],
      // 4. 輸出的檔名
      fileName: () => 'custom-table.bundle.js'
    },
    rollupOptions: {
      // 確保所有依賴（如 Lit）都被打進去，不要設為 external
      external: [],
      output: {
        // 強制把動態引用的內容全部合併
        inlineDynamicImports: true,
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    // 設為 false 方便你打開檔案檢查內容，確定沒問題後可改回 true 縮小體積
    minify: false 
  },
  // 解決 Lit 可能會在瀏覽器尋找 process.env 的報錯
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  }
});