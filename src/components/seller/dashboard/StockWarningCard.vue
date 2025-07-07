<script setup lang="ts">
const warnings = [
  { id: 1, name: '생강차', stock: 1 },
  { id: 2, name: '딸기잼', stock: 0 },
  { id: 3, name: '냉동만두', stock: 2 }
]
</script>

<template>
  <div class="card">
    <h3>⚠ 품절 임박</h3>
    <ul class="list">
      <li v-for="item in warnings" :key="item.id">
        <span class="name">{{ item.name }}</span>
        <span class="meta">재고 {{ item.stock }}개</span>
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
  color: #e74c3c;
  font-size: 0.8rem;
}
</style>
