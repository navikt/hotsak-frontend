module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 2023,
  },
  rules: {
    'node/no-missing-import': 0,
    'node/no-unpublished-import': [
      'error',
      {
        allowModules: ['msw', 'supertest', 'vitest'],
      },
    ],
  },
}
