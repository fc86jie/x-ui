/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 12:18:24
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-08 14:16:55
 * @FilePath: \webpack.prod.js
 * @Description:
 */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './src/index.js',
    button: './packages/button',
    aside: './packages/aside',
    main: './packages/main',
    header: './packages/header',
    container: './packages/container',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    library: {
      name: 'XUI',
      type: 'umd',
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
  externals: ['vue'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@packages': path.resolve(__dirname, 'packages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
};
