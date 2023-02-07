/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 12:03:58
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:17:29
 * @FilePath: \src\index.js
 * @Description:
 */

import * as Components from '@packages';
// 按需导出
export * from '@packages';
const { version, name } = require('../package.json');

const install = app => {
  Object.keys(Components).forEach(key => {
    app.use(Components[key]);
  });
};

export default {
  name,
  version,
  install,
  // 全量导出
  ...Components,
};
