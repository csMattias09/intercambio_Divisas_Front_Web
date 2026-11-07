import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Los helpers de Quasar (defineBoot, defineStore, defineRouter) solo envuelven la funcion
      '#q-app': fileURLToPath(new URL('./test/stubs/q-app.js', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      include: ['src/**/*.{js,vue}'],
    },
  },
})
