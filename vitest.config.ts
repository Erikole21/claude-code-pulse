import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // process.chdir() (meta/loader temp dirs) is unsupported in thread workers
    pool: 'forks',
  },
})
