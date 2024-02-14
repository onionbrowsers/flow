module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-trailing-spaces': 'off',
    'comma-dangle': 'off',
    'vue/valid-template-root': 'off',
    'camelcase': 'off',
    'no-unused-vars': 'off',
    'handle-callback-err': 'off',
    'eqeqeq': 'off',
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
