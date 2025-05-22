import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  esbuild: {
    target: 'esnext',
  },

  plugins: [
    vue(), 
    vueDevTools()
  ],
  
  server: {
    port: 10,
    host: '0.0.0.0',
    allowedHosts: ['7595-5-251-143-58.ngrok-free.app']
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  }
})