<script setup>
import DefaultLayout from './components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <Suspense>
      <template #default>
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </template>
      <template #fallback>
        <div class="loading">로딩 중입니다...</div>
      </template>
    </Suspense>
  </DefaultLayout>
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
