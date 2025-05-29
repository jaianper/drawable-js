import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';

export default [
  {
    files: ['**/*.js'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
      security: securityPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
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
      'unicorn/filename-case': 'off'
    },
  },
];