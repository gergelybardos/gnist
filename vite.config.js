import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    resolve: {
        alias: {
            'gnist': path.resolve(__dirname, './src/index.js')
        }
    },
    server: {
        open: '/sandbox/index.html',
    },
});
