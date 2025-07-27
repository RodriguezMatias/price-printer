import { defineConfig } from 'vitest/config'; // 👈 este es el cambio clave
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});