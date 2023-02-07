/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 23:02:30
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:08:52
 * @FilePath: \packages\main\index.js
 * @Description:
 */

import XMain from './Main.vue';

XMain.install = app => {
  app.component(XMain.name, XMain);
};

// 单独导出Main
export const Main = XMain;

export default XMain;
