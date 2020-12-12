module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // TODO: update in adler
  },
  settings: {
    react: {
      version: 'detect', // TODO: add in adler
    },
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    '@faculty/eslint-config-react',
  ],
  rules: {
    'flowtype/no-types-missing-file-annotation': 0,
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
