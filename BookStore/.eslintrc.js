module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'comma-dangle': "false",
    'no-console': ["error", { allow: ["warn", "error"] }],
    'linebreak-style': ["error", "windows"]
  },
};
