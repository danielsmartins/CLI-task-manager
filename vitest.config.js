import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.js'],
      exclude: [
        'src/index.js',
        'bin/**',
        'scripts/**',
        '**/*.test.js'
      ]
    }
  }
});
