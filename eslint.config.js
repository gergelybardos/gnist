import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            // Debug
            'no-console': 'warn',

            // Imports
            'no-duplicate-imports': 'error',

            // Variables
            'no-unused-vars': ['error', {
                'vars': 'all',
                'args': 'after-used',
                'ignoreRestSiblings': true
            }],
            'no-var': 'error',
            'prefer-const': 'error',

            // Logic
            'eqeqeq': ['error', 'always'],

            // Control flow
            'no-else-return': 'error',
            'no-useless-return': 'error',

            // Modern JS style
            'object-shorthand': 'error',
            'prefer-template': 'error',

            // Formatting
            'curly': 'error',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],

            // Whitespaces
            'no-trailing-spaces': 'error',
        }
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
        ],
    },
];
