/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 23:02:15
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:06:45
 * @FilePath: \packages\header\index.js
 * @Description:
 */

import XHeader from './Header.vue';

XHeader.install = app => {
  app.component(XHeader.name, XHeader);
};

// 单独导出Header
export const Header = XHeader;

export default XHeader;
