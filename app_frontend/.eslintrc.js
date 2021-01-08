module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': 'google',
  "extends": ["plugin:vue/base"],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
  ],
  'rules': {
    "no-console": "warn"
  }
};
