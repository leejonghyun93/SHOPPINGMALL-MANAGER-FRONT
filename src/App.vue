<!-- src/App.vue -->
<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// layout 컴포넌트를 동적으로 가져옴
const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'DefaultLayout'
  return defineAsyncComponent(() => import(`./components/layout/${layout}.vue`))
})
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
