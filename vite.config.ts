import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: "./src/__test__/setup.ts",
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/**',
                'dist/**',
                'build/**',
                'coverage/**',
                '**/*.config.{js,ts}',
                '**/*.test.{js,ts}',
                '**/*.spec.{js,ts}',
                'src/__test__/**',
                'src/mocks/**',
                'src/types/**',
                'public/**',
                '.next/**',
                '*.config.{js,ts,mjs}',
                'tailwind.config.js',
                'postcss.config.js',
                'next.config.js'
            ]
        }
    },
})