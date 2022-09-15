module.exports = {
    extends: ['../../.eslintrc.cjs'],
    parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['react'],
    settings: {
        react: {
            version: 'detect',
        },
    },
};
