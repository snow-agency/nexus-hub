import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
];
