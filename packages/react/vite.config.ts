import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'lib/index.ts',
            name: 'GuhReact',
            fileName: 'guh-react',
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@guh-md/editor'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@guh-md/editor': 'guh-editor'
                },
            },
        },
    },
    plugins: [react()],
});
