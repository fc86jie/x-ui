/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-08 15:43:25
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-08 16:03:44
 * @FilePath: \gulpfile.js
 * @Description: 构建scss文件
 */

const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function scss() {
  return src('src/styles/*.scss')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('lib/styles'));
}

exports.default = series(scss);
