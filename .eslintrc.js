module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-parameter-properties': [
      'error',
      {
        allows: ['private readonly'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'class-methods-use-this': 'off',
    'new-cap': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['*.test.{ts,js}', '*.spec.{ts,js}', 'test/**/*.{ts,js}'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-underscore-dangle': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'max-classes-per-file': 'off',
      },
    },
  ],
};
