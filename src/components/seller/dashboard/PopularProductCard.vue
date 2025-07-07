<script setup lang="ts">
const products = [
  { id: 1, name: '유기농 사과', views: 120 },
  { id: 2, name: '제주 감귤', views: 90 },
  { id: 3, name: '친환경 달걀', views: 80 }
]
</script>

<template>
  <div class="card">
    <h3>🔥 인기 상품</h3>
    <ul class="list">
      <li v-for="item in products" :key="item.id">
        <span class="name">{{ item.name }}</span>
        <span class="meta">{{ item.views }}회 조회</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
h3 {
  font-size: 1rem;
  margin-bottom: 0.6rem;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.name {
  font-weight: 500;
}
.meta {
  color: #888;
  font-size: 0.8rem;
}
</style>
