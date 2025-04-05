import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    test: {
        environment: 'jsdom', // Use jsdom for browser API emulation
        root: './',
        include: ['**/*.test.ts'],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo?.name?.endsWith('.js')) {
                        return '[name].js';
                    }
                    return 'assets/[name].[ext]';
                },
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
            },
        },
    },
    plugins: [
        dts({
            outDir: 'dist',
        }),
    ],
});