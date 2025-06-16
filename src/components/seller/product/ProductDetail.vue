<template>
  <ProductDetailLayout :tabs="tabs" :currentTab="currentTab" @update:currentTab="currentTab = $event">
    <template v-if="currentTab === '상품 상세정보'">
      <div class="main-row">
        <!-- 대표 이미지 (왼쪽, 크게) -->
        <div class="product-image-area">
          <img :src="product.image" alt="대표이미지" />
        </div>
        <!-- 상품 정보 (오른쪽, 테이블+버튼) -->
        <div class="product-meta-table">
          <div class="table-wrapper">
            <table>
              <tbody>
                <tr><th>상품번호</th><td>{{ product.id }}</td></tr>
                <tr><th>상품명</th><td>{{ product.name }}</td></tr>
                <tr><th>카테고리</th><td>{{ product.category }}</td></tr>
                <tr><th>상품가격</th><td>{{ product.price.toLocaleString() }}원</td></tr>
                <tr><th>판매가격</th><td>{{ product.salePrice.toLocaleString() }}원</td></tr>
                <tr><th>재고수량</th><td>{{ product.stock }}</td></tr>
                <tr><th>상품 조회수</th><td>{{ product.views }}</td></tr>
                <tr><th>판매량</th><td>{{ product.sold }}</td></tr>
                <tr><th>후기수</th><td>{{ product.reviews }}</td></tr>
                <tr><th>판매 상태</th><td>{{ product.status }}</td></tr>
                <tr><th>등록날짜</th><td>{{ product.createdAt }}</td></tr>
                <tr><th>수정날짜</th><td>{{ product.updatedAt }}</td></tr>
              </tbody>
            </table>
            <div class="bottom-actions">
              <button class="btn edit-btn" @click="goToEdit">수정</button>
              <button class="btn list-btn" @click="goToList">목록</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="currentTab === '후기'">
      <div class="tab-content">
        <h3>후기</h3>
        <ul>
          <li v-for="review in reviews" :key="review.id">
            <strong>{{ review.user }}</strong> ({{ review.date }}) - ★{{ review.rating }}<br>
            {{ review.content }}
          </li>
        </ul>
        <div v-if="reviews.length === 0" class="no-review">등록된 후기가 없습니다.</div>
      </div>
    </template>
    <template v-else-if="currentTab === '문의'">
      <div class="tab-content">
        <h3>문의</h3>
        <ul>
          <li v-for="inquiry in inquiries" :key="inquiry.id">
            <strong>{{ inquiry.user }}</strong> ({{ inquiry.date }})<br>
            {{ inquiry.content }}
          </li>
        </ul>
        <div v-if="inquiries.length === 0" class="no-inquiry">등록된 문의가 없습니다.</div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup>
import { ref } from 'vue';
import ProductDetailLayout from './ProductDetailLayout.vue';

const tabs = ['상품 상세정보', '후기', '문의'];
const currentTab = ref('상품 상세정보');

const product = {
  id: 'P001',
  image: 'https://via.placeholder.com/540x540?text=대표이미지',
  name: '예시 상품명',
  category: '카테고리명',
  price: 25000,
  salePrice: 22000,
  stock: 37,
  views: 1234,
  sold: 57,
  reviews: 2,
  status: '판매중',
  createdAt: '2025-06-01',
  updatedAt: '2025-06-14'
};
const reviews = [
  { id: 1, user: '홍길동', date: '2025-06-10', rating: 5, content: '아주 좋아요!' },
  { id: 2, user: '김철수', date: '2025-06-12', rating: 4, content: '만족합니다.' }
];
const inquiries = [
  { id: 1, user: '이영희', date: '2025-06-11', content: '배송은 얼마나 걸리나요?' },
  { id: 2, user: '박민수', date: '2025-06-13', content: '상품 색상 선택 가능한가요?' }
];

function goToList() {
  // 라우터 이동
}
function goToEdit() {
  // 라우터 이동
}
</script>

<style scoped>
.main-row {
  display: flex;
  justify-content: center;   /* 수평 중앙 정렬 */
  align-items: flex-start;   /* 필요시 center로 하면 수직도 중앙 */
  gap: 80px;                 /* 이미지-테이블 간격 */
  margin-bottom: 32px;
  width: 100%;
}
.product-image-area {
  flex: 0 0 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product-image-area img {
  width: 640px;
  height: 640px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #fafbfc;
}
.product-meta-table {
  flex: 1 1 0;
  min-width: 0;
  max-width: 700px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.product-meta-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
  font-size: 1.08rem;
  border: 1.5px solid #c7d1e0;
}
.product-meta-table th,
.product-meta-table td {
  padding: 14px 18px;
  border: 1px solid #c7d1e0;
  background: #fff;
}
.product-meta-table th {
  background: #f7faff;
  width: 120px;
  font-weight: 600;
}
.bottom-actions {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn {
  padding: 8px 22px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
}
.list-btn {
  background: #eceff7;
  color: #333;
}
.list-btn:hover {
  background: #dde2ee;
}
.edit-btn {
  background: #3e7eff;
  color: #fff;
}
.edit-btn:hover {
  background: #295fc5;
}
.tab-content {
  padding: 32px 0;
  color: #555;
}
.no-review,
.no-inquiry {
  color: #888;
  padding: 32px 0;
  text-align: center;
}
@media (max-width: 1200px) {
  .main-row {
    flex-direction: column;
    gap: 32px;
  }
  .product-image-area img {
    width: 90vw;
    max-width: 520px;
    height: auto;
  }
  .product-meta-table {
    width: 100%;
    max-width: none;
    margin-left: 0;
  }
}
</style>
