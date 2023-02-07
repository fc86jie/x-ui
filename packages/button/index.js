/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 17:52:09
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:08:16
 * @FilePath: \packages\button\index.js
 * @Description:
 */

import XButton from './Button.vue';

XButton.install = app => {
  app.component(XButton.name, XButton);
};

// 单独导出Button
export const Button = XButton;

export default XButton;
