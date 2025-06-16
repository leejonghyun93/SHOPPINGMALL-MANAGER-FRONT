<script setup>
import SellerHeader from '@/components/layout/SellerHeader.vue'
import SellerSidebar from '@/components/layout/SellerSidebar.vue'
import SellerFooter from '@/components/layout/SellerFooter.vue'
</script>

<template>
  <div class="app-layout">
    <SellerSidebar class="seller-sidebar" />
    <div class="main-content">
      <SellerHeader />
      <div class="content-wrapper">
        <slot /> <!-- router-view가 이 위치에 렌더링됨 -->
      </div>
      <SellerFooter />
    </div>
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  background: #22242a;
}

.seller-sidebar {
  width: 14%;
  background-color: #2f3247;
  color: white;
  height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
}

.main-content {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 4rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: 0;
}
</style>