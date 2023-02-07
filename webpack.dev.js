/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 12:18:24
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 22:29:59
 * @FilePath: \webpack.dev.js
 * @Description:
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    index: './example/src/index.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
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
    new VueLoaderPlugin(),
  ],
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
