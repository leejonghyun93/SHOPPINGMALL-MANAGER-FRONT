<!-- src/App.vue -->
<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 현재 라우트의 layout meta값을 기반으로 동적으로 컴포넌트 로딩
const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'DefaultLayout'
  return defineAsyncComponent(() => import(`@/components/layout/${layout}.vue`))
})
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>