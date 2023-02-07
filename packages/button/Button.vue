<!--
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-07 17:51:20
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-07 23:05:43
 * @FilePath: \packages\button\button.vue
 * @Description: 
-->

<template>
  <button class="x-button" :class="[buttonType, buttonSize]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'XButton',
};
</script>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    required: false,
    type: String,
    default: 'default',
  },
  size: {
    required: false,
    type: String,
    default: 'default',
  },
});

const buttonType = computed(() => `x-button--${props.type}`);
const buttonSize = computed(() => `x-button-${props.size}`);
</script>
