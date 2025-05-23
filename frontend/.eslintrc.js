module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Allow different OS line endings
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'react-native/no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
