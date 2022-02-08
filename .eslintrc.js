module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/static-property-placement': [0],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': [0],
    'react/destructuring-assignment': [1],
    'react/jsx-props-no-spreading': [0],
    'react/prefer-stateless-function': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'jsx-a11y/no-static-element-interactions': [1],
    'jsx-a11y/control-has-associated-label': [0],
    'no-use-before-define': [0],
    'no-param-reassign': [0],
    'no-nested-ternary': [0],
  },
};
