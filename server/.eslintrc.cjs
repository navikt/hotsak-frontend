module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'node/no-missing-import': 0,
    'node/no-unsupported-features/es-syntax': 0,
  },
}
