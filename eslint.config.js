import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
import jestPlugin from 'eslint-plugin-jest';

export default [
    {
        files: ['**/*.js','**/*.test.js'],
        ignores: ['dist/**', 'node_modules/**'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                jest: 'readonly',
            }
        },
        plugins: {
            import: importPlugin,
            security: securityPlugin,
            unicorn: unicornPlugin,
            jest: jestPlugin
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            indent: ['error', 4],
            'no-unused-vars': 'warn',
            'no-console': 'off',
            // eslint-plugin-import rules
            'import/no-unresolved': 'error',
            'import/no-duplicates': 'warn',
            // eslint-plugin-security rules
            'security/detect-object-injection': 'warn',
            // eslint-plugin-unicorn rules
            'unicorn/prevent-abbreviations': 'off', // 
            'unicorn/no-null': 'off',
            //'unicorn/filename-case': ['error', { case: 'kebabCase' }],
            'unicorn/filename-case': 'off',
            'jest/no-disabled-tests': 'warn',
            'jest/no-identical-title': 'error',
            'jest/expect-expect': 'warn',
        },
    },
];