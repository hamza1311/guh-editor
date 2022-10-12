import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'GuhMd',
            fileName: 'guh-md',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: [
                // these all are installed with npm install on build
                /^lit/,
                'highlight.js',
                /@codemirror\/\w+/,
                /@lezer\/\w+/,
                'marked',
            ],
            output: {
                globals: {
                    lit: 'lit',
                    marked: 'marked',
                    'lit/decorators.js': 'lit/decorators.js',
                    '@codemirror/view': '@codemirror/view',
                    '@codemirror/state': '@codemirror/state',
                    '@codemirror/language': '@codemirror/language',
                    '@codemirror/commands': '@codemirror/commands',
                    '@codemirror/autocomplete': '@codemirror/autocomplete',
                    '@codemirror/lang-markdown': '@codemirror/lang-markdown',
                    '@codemirror/language-data': '@codemirror/language-data',
                    '@lezer/markdown': '@lezer/markdown',
                    'lit/directives/until.js': 'lit/directives/until.js',
                    'lit/directives/unsafe-svg.js': 'lit/directives/unsafe-svg.js',
                },
            },
        },
    },
    plugins: [
        visualizer({
            gzipSize: true,
            template: 'sunburst',
        }),
    ],
});
