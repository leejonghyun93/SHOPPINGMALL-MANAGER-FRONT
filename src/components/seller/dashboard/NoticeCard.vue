<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const notices = [
  { id: 1, title: '라이브 방송 품질 가이드 안내' },
  { id: 2, title: '7월 정기점검 일정 공지' },
  { id: 3, title: '고객센터 운영시간 변경 안내' }
]

const goToNoticePage = () => {
  router.push('/notice') // 추후 공지사항 전체 페이지 만들면 연결
}
</script>

<template>
  <div class="card">
    <div class="header">
      <h3>📢 공지사항</h3>
      <button class="more-btn" @click="goToNoticePage">더보기</button>
    </div>
    <ul class="list">
      <li v-for="item in notices" :key="item.id">
        {{ item.title }}
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.more-btn {
  font-size: 0.85rem;
  border: none;
  background: none;
  color: #3b82f6;
  cursor: pointer;
}
.list {
  margin-top: 0.6rem;
  list-style: none;
  padding: 0;
}
.list li {
  font-size: 0.9rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}
</style>
