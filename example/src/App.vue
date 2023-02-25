<!--
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 13:05:24
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-25 17:28:23
 * @FilePath: \example\src\App.vue
 * @Description: 
-->

<template>
  <div class="example-container">
    <x-time-selection v-model="time"></x-time-selection>
    <x-header>头部</x-header>
    <x-container>
      <x-aside width="200px">菜单</x-aside>
      <x-main>
        <header>xxx</header>
        <x-button>按钮</x-button>
        <x-button type="primary" size="small">按钮</x-button>
        <x-button type="danger" size="large">按钮</x-button>
        <x-button type="info">按钮</x-button>
        <x-button type="success">按钮</x-button>
        <x-button type="warning">按钮</x-button>
      </x-main>
    </x-container>
    <x-header>尾部</x-header>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    let time = ref('');
    return {
      time,
    };
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}

.example-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .x-header {
    background-color: aquamarine;
  }
  .x-container {
    background-color: blueviolet;
  }
  .x-aside {
    background-color: cornflowerblue;
  }
  .x-main {
    background-color: crimson;
  }
}
</style>
