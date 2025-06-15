module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    '@babel/plugin-transform-export-namespace-from', // 👈 plugin để fix lỗi zod esm
    'react-native-reanimated/plugin', // 👈 luôn để cuối
  ],
};
