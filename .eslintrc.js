module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'jest', 'import', 'eslint-comments'],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
