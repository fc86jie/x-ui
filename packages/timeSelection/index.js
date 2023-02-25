/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-25 09:58:40
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-25 09:58:40
 * @FilePath: \packages\timeSelection\index.js
 * @Description:
 */

import XTimeSelection from './TimeSelection.vue';

XTimeSelection.install = app => {
  app.component(XTimeSelection.name, XTimeSelection);
};

// 单独导出TimeSelection
export const TimeSelection = XTimeSelection;

export default XTimeSelection;
