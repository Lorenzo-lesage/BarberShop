import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',     // 🔥 fondamentale
        port: 5173,
        strictPort: true,
        hmr: {
            host: '192.168.1.73', // 🔥 IP DEL TUO PC
        },
    },
});
