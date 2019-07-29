module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ["react-hooks", "react"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    },
    sourceType: "module"
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": "off",
    "react/prop-types": "off",
    "react/display-name": "off"
  }
};
