import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: path.resolve(__dirname, 'sandbox'),
    base: './',
    resolve: {
        alias: {
            gnist: path.resolve(__dirname, 'src/index.js'),
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'docs/site/showcase'),
        emptyOutDir: false,
    },
});
