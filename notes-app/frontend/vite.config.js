import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.js',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**'
    ]
  }
})