/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 23:01:38
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:01:42
 * @FilePath: \packages\aside\index.js
 * @Description:
 */

import XAside from './Aside.vue';

XAside.install = app => {
  app.component(XAside.name, XAside);
};

// 单独导出Aside
export const Aside = XAside;

export default XAside;
