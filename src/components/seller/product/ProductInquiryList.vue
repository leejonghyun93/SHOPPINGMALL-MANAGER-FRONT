<template>
  <div class="inquiry-management">
    <h2>상품 문의 관리</h2>
    <table class="inquiry-table">
      <thead>
        <tr>
          <th>문의번호</th>
          <th>상품명</th>
          <th>문의내용</th>
          <th>작성자</th>
          <th>등록일자</th>
          <th>공개여부</th>
          <th>답변여부</th>
          <th>답변일자</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inquiry in pagedInquiries" :key="inquiry.id">
          <td>{{ inquiry.id }}</td>
          <td>{{ inquiry.productName }}</td>
          <td>
  <a
    href="#"
    class="inquiry-link"
    @click.prevent="goToInquiryDetail(inquiry.id)"
  >
    {{ shortContent(inquiry.content) }}
  </a>
</td>
          <td>{{ inquiry.author }}</td>
          <td>{{ inquiry.date }}</td>
          <td>{{ inquiry.isPublic ? '공개' : '비공개' }}</td>
          <td>
            <span :class="['answer-status', inquiry.answered ? 'answered' : 'not-answered']">
              {{ inquiry.answered ? '답변완료' : '미완료' }}
            </span>
          </td>
          <td>{{ inquiry.answered ? inquiry.answeredAt : '-' }}</td>
        </tr>
        <tr v-if="pagedInquiries.length === 0">
          <td colspan="8" style="text-align:center;">문의 데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <div class="inquiry-table-bottom-bar">
      <div class="inquiry-pagination-wrapper">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function goToInquiryDetail(id) {
  router.push({ name: 'InquiryDetail', params: { id } });
}

const props = defineProps({
  productId: { type: String, required: false } // 필요에 따라 활용
});

// 샘플 문의 데이터 (실제 API 연동 시 교체)
const inquiries = ref([
  {
    id: 1,
    productName: '수박',
    content: '배송이 언제 되나요? 빠른 답변 부탁드립니다.',
    author: '홍길동',
    date: '2025-06-17',
    isPublic: true,
    answered: true,
    answeredAt: '2025-06-18',
  },
  {
    id: 2,
    productName: '사과',
    content: '상품 색상 선택 가능한가요?',
    author: '김철수',
    date: '2025-06-16',
    isPublic: false,
    answered: false,
    answeredAt: '',
  },
  // ...더 많은 데이터
]);

// 페이징 관련 상태
const currentPage = ref(1);
const pageSize = 5;

const totalPages = computed(() => Math.ceil(inquiries.value.length / pageSize));

const pagedInquiries = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return inquiries.value.slice(start, start + pageSize);
});

// 문의내용 20글자 제한 함수
function shortContent(content) {
  return content.length > 20 ? content.slice(0, 20) + '...' : content;
}

// 페이징 함수
function goToPage(page) {
  currentPage.value = page;
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
</script>

<style scoped>
.inquiry-management {
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
.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem;
}
.inquiry-table th,
.inquiry-table td {
  border: 1px solid #c7d1e0;
  padding: 0.7rem 0.4rem;
  text-align: center;
  font-size: 1.09rem;
}
.inquiry-table th {
  background: #f7faff;
  font-weight: 600;
}
.inquiry-table td {
  background: #fff;
}

/* 답변여부 스타일 */
.answer-status {
  display: inline-block;
  padding: 0.22em 1.1em;
  border-radius: 16px;
  font-size: 1.02rem;
  font-weight: 600;
}
.answer-status.answered {
  background: #2563eb;
  color: #fff;
}
.answer-status.not-answered {
  background: #e5e7eb;
  color: #888;
}

/* 하단 바 스타일 */
.inquiry-table-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 36px 0 0 0;
}
.inquiry-pagination-wrapper {
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
.inquiry-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s;
}
.inquiry-link:hover {
  color: #1746a2;
}
</style>
