import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/guh-editor.ts',
            name: 'Guh',
            fileName: 'guh',
            formats: ['es'],
        },
        rollupOptions: {
            external: /^lit/,
        },
    },
});
