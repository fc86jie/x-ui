/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 23:02:01
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:06:05
 * @FilePath: \packages\container\index.js
 * @Description:
 */

import XContainer from './Container.vue';

XContainer.install = app => {
  app.component(XContainer.name, XContainer);
};

// 单独导出Container
export const Container = XContainer;

export default XContainer;
