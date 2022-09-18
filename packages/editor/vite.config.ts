import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'GuhMd',
            fileName: 'guh-md',
            formats: ['es']
        },
        rollupOptions: {
            external: [
                // these all are installed with npm install on build
                /^lit/,
                'highlight.js',
                /@codemirror\/\w+/,
                /@material\/\w+/,
                /@lezer\/\w+/,
                'marked',
            ]
        },
    },
    plugins: [visualizer({
        gzipSize: true,
        template: 'sunburst'
    })],
});
