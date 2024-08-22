import { defineConfig } from "vite";
import * as path from 'path'
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@img': path.resolve(__dirname, "./src/static/images"),
		},
	},
  plugins: [
    uni(),
    // 自动导入配置
		AutoImport({
			imports: [
				// 预设
				'vue',
				'vue-router',
				'uni-app'
			]
		})
  ],
});
