/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 12:18:24
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 12:27:43
 * @FilePath: \webpack.dev.js
 * @Description:
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './example/src/index.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    static: [path.resolve(__dirname, 'example/public'), path.resolve(__dirname, 'dist')],
    port: 8080,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'example/public/index.html'),
      filename: 'index.html',
      chunks: ['index'],
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@packages': path.resolve(__dirname, 'packages/'),
      '@utils': path.resolve(__dirname, 'utils/'),
      '@lib': path.resolve(__dirname, 'utils/'),
    },
  },
};
