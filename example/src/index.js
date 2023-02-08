/**
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 12:11:27
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-08 13:58:14
 * @FilePath: \example\src\index.js
 * @Description:
 */

import XUI, { Button } from '@/index';

import '@styles/index.scss';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(XUI).mount('#app');
