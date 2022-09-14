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
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            // external: ['react', 'react-dom'],
            // output: {
            //   // Provide global variables to use in the UMD build
            //   // for externalized deps
            //   globals: {
            //     vue: 'React',
            //     'react-dom': 'ReactDOM',
            //   }
            // }
        },
    },
    plugins: [react()],
});
