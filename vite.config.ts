import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    // Uncomment if you need code coverage reports
    // coverage: {
    //   provider: 'c8',
    //   reporter: ['text', 'json', 'html'],
    // },
  },
})
