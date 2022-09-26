module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      files: ["./hardhat.config.ts"]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  rules: {
    "prettier/prettier": ["error"],
    "@typescript-eslint/strict-boolean-expressions": 0,
    "@typescript-eslint/no-namespace": "off",
    "no-new": 0,
    "@typescript-eslint/no-unused-expressions": 0,
  },
}
