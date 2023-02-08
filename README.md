# xfc-ui

### 目录结构

```
├── example ---------- 使用案例
├── lib -------------- 输出资源文件夹
├── packages --------- 组件源代码
├── src -------------- 源代码文件
├── utils ------------ 工具函数目录
```

### 组件库构建

- 使用 webpack 构建组件 js
- 使用 gulp 构建 css

### 使用方式

```javascript
// 全量加载
import XUI from 'xfc-ui';
import 'xfc-ui/lib/styles/index.css';
createApp(App).use(XUI).mount('#app');

// 按需加载
import XButton from 'xfc-ui/lib/button';
import 'xfc-ui/lib/styles/button.css';
export default {
  name: 'App',
  components: {
    XButton,
  },
};

// 借助 babel-plugin-component，我们可以只引入需要的组件
// 安装 babel-plugin-component，然后再babel的配置文件中增加如下代码
{
  "plugins": [
    [
      "component",
      {
        "libraryName": "xfc-ui",
        "styleLibraryName": "styles"
      }
    ]
  ]
}
```
