import pluginJs from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: {
            parser: typescriptEslintParser,
        },
    },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            import: pluginImport,
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/no-invalid-void-type': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/no-unescaped-entities': 'off',
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'import/order': [
                'warn',
                {
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'builtin',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    warnOnUnassignedImports: true,
                    'newlines-between': 'never',
                },
            ],
        },
    },
    {
        ignores: ['node_modules/*', 'dist/*', 'build/*', '.expo/*', 'babel.config.js'],
    },
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
