<template>
  <div class="review-management">
     <h2>상품 후기 관리</h2>
    <table class="review-table">
      <thead>
        <tr>
          <th><input type="checkbox" v-model="allSelected" @change="toggleSelectAll" /></th>
          <th>후기번호</th>
          <th>후기상품명</th>
          <th>후기내용</th>
          <th>작성자</th>
          <th>등록일자</th>
          <th>수정일자</th>
          <th>후기표시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in pagedReviews" :key="review.id">
          <td><input type="checkbox" v-model="selectedIds" :value="review.id" /></td>
          <td>{{ review.id }}</td>
          <td>{{ review.productName }}</td>
          <td>
  <router-link
  :to="{ name: 'ProductReviewDetail', params: { reviewId: review.id } }"
  class="review-link"
>
  {{ shortContent(review.content) }}
</router-link>
</td>
          <td>{{ review.author }}</td>
          <td>{{ review.date }}</td>
          <td>{{ review.updatedAt }}</td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="review.visible" @change="toggleVisibility(review)" />
              <span class="slider"></span>
            </label>
            <span class="status-text">{{ review.visible ? '게시' : '미게시' }}</span>
          </td>
        </tr>
        <tr v-if="pagedReviews.length === 0">
          <td colspan="7" style="text-align:center;">후기 데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <!-- 하단 바: 페이징(가운데) + 버튼(오른쪽) -->
    <div class="review-table-bottom-bar">
      <div class="review-pagination-wrapper">
        <div class="pagination">
          <button class="btn-main" @click="prevPage" :disabled="currentPage === 1">이전</button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="['btn-main', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
          <button class="btn-main" @click="nextPage" :disabled="currentPage === totalPages">다음</button>
        </div>
      </div>
      <div class="review-bottom-btns">
        <button class="btn-main" @click="changeVisibility(true)" :disabled="selectedIds.length === 0">선택 게시</button>
        <button class="btn-main" @click="changeVisibility(false)" :disabled="selectedIds.length === 0">선택 미게시</button>
      </div>
    </div>

    <div v-if="confirmDialog.visible" class="confirm-dialog">
      <div class="dialog-content">
        <p>{{ confirmDialog.message }}</p>
        <button class="btn-main" @click="confirmDialogConfirm">확인</button>
        <button class="btn-main" @click="confirmDialogCancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';


// 샘플 후기 데이터 (실제 API 연동 시 교체)
const reviews = ref([
  {
    id: 1,
    productName: '수박',
    content: '정말 신선하고 맛있습니다. 다음에도 또 구매할게요!',
    author: '홍길동',
    date: '2025-06-05',
    updatedAt: '2025-06-07',
    visible: true,
  },
  {
    id: 2,
    productName: '사과',
    content: '맛도 좋고 배송도 빨랐어요.',
    author: '김철수',
    date: '2025-06-12',
    updatedAt: '2025-06-14',
    visible: false,
  },
  // ...더 많은 데이터
]);

// 페이징 관련 상태
const currentPage = ref(1);
const pageSize = 5;

const totalPages = computed(() => Math.ceil(reviews.value.length / pageSize));

const pagedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return reviews.value.slice(start, start + pageSize);
});

// 체크박스 선택 관리
const selectedIds = ref([]);
const allSelected = ref(false);

watch(selectedIds, (newVal) => {
  allSelected.value = pagedReviews.value.length > 0 && pagedReviews.value.every(r => newVal.includes(r.id));
});

function toggleSelectAll() {
  if (allSelected.value) {
    // 전체 선택
    selectedIds.value = pagedReviews.value.map(r => r.id);
  } else {
    // 전체 해제
    selectedIds.value = [];
  }
}

// 후기내용 20글자 제한 함수
function shortContent(content) {
  return content.length > 20 ? content.slice(0, 20) + '...' : content;
}

// 후기표시 토글 (개별)
function toggleVisibility(review) {
  review.visible = !review.visible;
}

// 일괄 게시/미게시 변경 관련
const confirmDialog = ref({
  visible: false,
  message: '',
  action: null,
  targetVisibility: null,
});

function changeVisibility(visible) {
  if (selectedIds.value.length === 0) return;

  confirmDialog.value = {
    visible: true,
    message: `선택한 ${selectedIds.value.length}개의 후기를 ${visible ? '게시' : '미게시'} 처리하시겠습니까?`,
    action: () => {
      reviews.value.forEach(r => {
        if (selectedIds.value.includes(r.id)) {
          r.visible = visible;
        }
      });
      selectedIds.value = [];
      confirmDialog.value.visible = false;
    },
    targetVisibility: visible,
  };
}

function confirmDialogConfirm() {
  if (confirmDialog.value.action) {
    confirmDialog.value.action();
  }
}

function confirmDialogCancel() {
  confirmDialog.value.visible = false;
}

// 페이징 함수
function goToPage(page) {
  currentPage.value = page;
  selectedIds.value = [];
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectedIds.value = [];
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    selectedIds.value = [];
  }
}
</script>

<style scoped>
.review-management {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 40px 48px 48px 48px;
  box-sizing: border-box;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 32px;
  font-weight: 700;
  color: #222;
}
.review-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem;
}
.review-table th,
.review-table td {
  border: 1px solid #c7d1e0;
  padding: 0.7rem 0.4rem;
  text-align: center;
  font-size: 1.09rem;
}
.review-table th {
  background: #f7faff;
  font-weight: 600;
}
.review-table td {
  background: #fff;
}
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  vertical-align: middle;
  margin-top: 12px; /* 아래로 내림 */
  margin-right: 6px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2563eb;
}
input:checked + .slider:before {
  transform: translateX(16px);
}
.status-text {
  vertical-align: middle;
  font-weight: 600;
  font-size: 1.05rem;
  margin-left: 2px;
}

/* 하단 바 스타일 */
.review-table-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 36px 0 0 0;
  gap: 0;
}
.review-pagination-wrapper {
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  width: 100%;
}
.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  scrollbar-width: thin;
}
.review-bottom-btns {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

/* 버튼 스타일(paste.txt 스타일 통일) */
.btn-main {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.13rem;
  font-weight: 700;
  padding: 0.54rem 1.6rem;
  cursor: pointer;
  transition: background 0.2s;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
}
.btn-main.active,
.pagination .btn-main.active {
  background: #1746a2;
  color: #fff;
}
.btn-main:disabled {
  background: #e5e7eb;
  color: #b3b9c9;
  cursor: not-allowed;
}
.btn-main:hover {
  background: #1746a2;
}

/* 모달 스타일 */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.dialog-content {
  background: white;
  padding: 1.8rem 2.6rem;
  border-radius: 8px;
  text-align: center;
  min-width: 260px;
}
.dialog-content button {
  margin: 0 10px;
  margin-top: 18px;
}
.review-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s;
}
.review-link:hover {
  color: #1746a2;
}
</style>
