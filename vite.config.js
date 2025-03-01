import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/travell.github.io/',  // 设置基础路径为GitHub Pages仓库名
})
