<template>
  <div class="broadcast-list-wrapper">
    <h2 class="section-title">나의 방송 목록</h2>
    <table class="broadcast-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>방송자</th>
          <th>방송일자</th>
          <th>시청자수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(broadcast, index) in broadcasts" :key="broadcast.id">
          <td>{{ index + 1 }}</td>
          <td>{{ broadcast.category }}</td>
          <td>{{ broadcast.title }}</td>
          <td>{{ broadcast.broadcaster }}</td>
          <td>{{ formatDate(broadcast.date) }}</td>
          <td>{{ broadcast.total_count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const broadcasts = ref([
  {
    id: 1,
    category: '신선식품',
    title: '여름 시즌 특집 방송',
    broadcaster: '홍길동',
    date: '2025-07-01',
    total_count: 55,
  },
  {
    id: 2,
    category: '신선식품',
    title: '뷰티 제품 소개 라이브',
    broadcaster: '김민지',
    date: '2025-07-02',
    total_count: 55,
  },
  {
    id: 3,
    category: '신선식품',
    title: '신제품 런칭 방송',
    broadcaster: '박지훈',
    date: '2025-07-03',
    total_count: 55,
  },
  {
    id: 4,
    category: '신선식품',
    title: '재고 정리 세일 방송',
    broadcaster: '이서준',
    date: '2025-07-04',
    total_count: 55,
  },
])

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<style scoped>
.broadcast-list-wrapper {
  font-family: 'Noto Sans KR', sans-serif;
  width: 100%;
  flex: 1;
  padding: 0;
  margin: 0;
  min-height: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.broadcast-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.broadcast-table thead,
.broadcast-table th {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #e2e2e2;
  text-align: left;
}

.broadcast-table tr,
.broadcast-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.broadcast-table tbody tr:hover {
  background-color: #f9f9f9;
}
</style>