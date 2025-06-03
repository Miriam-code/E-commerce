module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:prettier/recommended" 
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: [
        "prettier" 
    ],
    rules: {   
      "no-console": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], 
      "prettier/prettier": "error"
    },
    ignorePatterns: [
      "node_modules",
      "dist",
      "coverage"
    ]
  };
  