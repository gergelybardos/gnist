import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
