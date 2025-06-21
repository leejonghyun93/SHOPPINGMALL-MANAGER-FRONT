<template>
  <div class="review-detail">
    <div class="review-detail-header">
      <div class="review-detail-title-above">후기 상세보기</div>
      <button class="btn-main list-btn-top" @click="goToReviewList">
        <span class="icon-arrow">&#8592;</span> 목록
      </button>
    </div>

    <div class="review-info-row">
      <span class="review-id">{{ review.id }}</span>
      <span class="review-product">{{ review.productName }}</span>
      <span class="review-author">{{ review.author }}</span>
      <span class="review-date">{{ review.date }}</span>
    </div>

    <div class="review-image-section">
      <template v-if="review.imageUrls && review.imageUrls.length">
        <div class="image-slider">
          <img
            v-for="(img, idx) in review.imageUrls"
            :key="idx"
            :src="img"
            alt="리뷰 사진"
            class="review-image"
            @click="openModal(idx)"
          />
        </div>
      </template>
      <template v-else>
        <div class="no-image">
          <span class="no-image-icon">🖼️</span>
          <span class="no-image-text">이미지 없음</span>
        </div>
      </template>
    </div>

    <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
      <img :src="review.imageUrls[modalIndex]" class="modal-image" />
    </div>

    <div class="review-content-card">
      <div class="review-content-title">리뷰 내용</div>
      <div class="review-content-text">{{ review.content }}</div>
    </div>

    <div class="review-reply-card" :class="{ 'has-reply': review.reply }">
      <div class="reply-title">답변</div>
      <template v-if="review.reply">
        <div class="reply-content">{{ review.reply }}</div>
        <button class="btn-main btn-edit" @click="editReply = true" v-if="!editReply">수정</button>
        <button class="btn-main btn-delete" @click="deleteReply">삭제</button>
      </template>
      <template v-else>
        <div class="reply-form">
          <textarea
            v-model="replyText"
            placeholder="답변을 입력하세요 (최소 5자)"
            rows="4"
            class="reply-textarea"
            :maxlength="maxLength"
            :disabled="loading"
          ></textarea>
          <div class="reply-footer">
            <span class="char-count">{{ replyText.length }} / {{ maxLength }}</span>
            <button class="btn-main" :disabled="!canSubmit || loading" @click="submitReply">
              <span v-if="loading" class="spinner"></span>
              답변 등록
            </button>
          </div>
        </div>
      </template>
      <div v-if="editReply" class="reply-form">
        <textarea
          v-model="replyEditText"
          rows="4"
          class="reply-textarea"
          :maxlength="maxLength"
        ></textarea>
        <div class="reply-footer">
          <span class="char-count">{{ replyEditText.length }} / {{ maxLength }}</span>
          <button class="btn-main" @click="saveEditReply">저장</button>
          <button class="btn-main btn-cancel" @click="editReply = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const review = ref({
  id: route.params.id,
  productName: '사과',
  author: '김철수',
  date: '2025-06-12',
  imageUrls: [
    '/sample1.jpg',
    '/sample2.jpg'
  ],
  content: '맛도 좋고 배송도 빨랐어요.',
  reply: '',
});

const isModalOpen = ref(false);
const modalIndex = ref(0);
function openModal(idx) {
  modalIndex.value = idx;
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}

const replyText = ref('');
const replyEditText = ref('');
const editReply = ref(false);
const maxLength = 300;
const minLength = 5;
const loading = ref(false);

const canSubmit = computed(() =>
  replyText.value.trim().length >= minLength && replyText.value.length <= maxLength
);

function submitReply() {
  if (!canSubmit.value) return;
  loading.value = true;
  setTimeout(() => {
    review.value.reply = replyText.value;
    replyEditText.value = replyText.value;
    replyText.value = '';
    loading.value = false;
    alert('답변이 등록되었습니다.');
  }, 800);
}

function saveEditReply() {
  if (replyEditText.value.trim().length >= minLength) {
    review.value.reply = replyEditText.value;
    editReply.value = false;
    alert('답변이 수정되었습니다.');
  }
}
function deleteReply() {
  if (confirm('답변을 삭제하시겠습니까?')) {
    review.value.reply = '';
    replyEditText.value = '';
    editReply.value = false;
  }
}

function goToReviewList() {
  router.push({ name: 'ProductReviewList', params: { productCode: route.params.productCode } });
}
</script>

<style scoped>
.review-detail {
  max-width: 100%;
  margin: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 16px 24px 16px;
  position: relative;
}
.review-detail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px; /* 제목과 버튼 사이 간격을 좁힘 */
}
.review-detail-title-above {
  text-align: center;
  font-size: 1.35rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 4px; /* 버튼과 더 붙게 */
}
.list-btn-top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.09rem;
  font-weight: 700;
  padding: 0.54rem 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
}
.list-btn-top:hover {
  background: #1746a2;
}
.icon-arrow {
  font-size: 1.15rem;
  margin-right: 2px;
}
.review-info-row {
  display: flex;
  gap: 48px;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 28px;
  padding: 18px 10px 10px 18px;
  background: #f8fafc;
  border-radius: 8px;
}
.review-id::before {
  content: "후기번호 : #";
  color: #2563eb;
  margin-right: 4px;
}
.review-product::before {
  content: "상품명 : ";
  color: #222;
  margin-right: 4px;
}
.review-author::before {
  content: "작성자 : ";
  color: #555;
  margin-right: 4px;
}
.review-date::before {
  content: "등록일자 : ";
  color: #888;
  margin-right: 4px;
}
.review-image-section {
  text-align: center;
  margin-bottom: 24px;
}
.image-slider {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.review-image {
  max-width: 140px;
  max-height: 120px;
  border-radius: 8px;
  object-fit: cover;
  background: #f4f4f4;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.review-image:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.13);
}
.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  font-size: 1.12rem;
  padding: 24px 0;
}
.no-image-icon {
  font-size: 2.2rem;
}
.modal-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-image {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 12px;
  background: #fff;
}
.review-content-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px 16px 18px 16px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.review-content-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 8px;
}
.review-content-text {
  font-size: 1.2rem;
  color: #222;
  line-height: 1.7;
}
.review-reply-card {
  background: #f7faff;
  border-radius: 8px;
  padding: 18px 16px 14px 16px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.05);
  border-left: 5px solid #2563eb;
  position: relative;
}
.review-reply-card.has-reply {
  background: #e6f0ff;
  border-left: 6px solid #1746a2;
}
.reply-title {
  font-size: 1.04rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 10px;
}
.reply-content {
  font-size: 1.13rem;
  color: #1746a2;
  margin-bottom: 10px;
  word-break: break-all;
}
.reply-form {
  margin-top: 0;
}
.reply-textarea {
  width: 100%;
  border: 1px solid #c7d1e0;
  border-radius: 7px;
  font-size: 1.07rem;
  padding: 10px;
  margin-bottom: 10px;
  resize: vertical;
}
.reply-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.char-count {
  font-size: 0.97rem;
  color: #777;
}
.btn-main {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.09rem;
  font-weight: 700;
  padding: 0.54rem 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 8px;
}
.btn-main:disabled {
  background: #b6c6e0;
  cursor: not-allowed;
}
.btn-main:hover:not(:disabled) {
  background: #1746a2;
}
.btn-edit {
  margin-left: 0;
  background: #fff;
  color: #2563eb;
  border: 1px solid #2563eb;
}
.btn-edit:hover {
  background: #e6f0ff;
}
.btn-delete {
  background: #fff;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  margin-left: 10px;
}
.btn-delete:hover {
  background: #ffeaea;
}
.btn-cancel {
  background: #fff;
  color: #888;
  border: 1px solid #bbb;
  margin-left: 10px;
}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top: 2px solid #2563eb;
  animation: spin 0.8s linear infinite;
  margin-right: 6px;
  vertical-align: middle;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
@media (max-width: 640px) {
  .review-detail { padding: 10px 2vw; }
  .review-info-row { gap: 16px; font-size: 1rem; }
}
</style>
