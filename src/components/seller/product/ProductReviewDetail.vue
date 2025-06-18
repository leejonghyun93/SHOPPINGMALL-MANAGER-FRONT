<template>
  <div class="inquiry-detail">
    <!-- 제목만 맨 위 중앙 -->
    <div class="inquiry-detail-title-above">문의 상세보기</div>
    <!-- 목록 버튼만 한 줄 아래 왼쪽 -->
    <div class="inquiry-detail-header">
      <button class="btn-main list-btn-top" @click="goToInquiryList">
        <span class="icon-arrow">&#8592;</span> 목록
      </button>
    </div>

    <!-- 문의 정보 (한 줄, 일자 배치) -->
    <div class="inquiry-info-row">
      <span class="inquiry-id">{{ inquiry.id }}</span>
      <span class="inquiry-title">{{ inquiry.title }}</span>
      <span class="inquiry-author">{{ inquiry.author }}</span>
      <span class="inquiry-date">{{ inquiry.date }}</span>
    </div>

    <!-- 문의 내용 -->
    <div class="inquiry-content-card">
      <div class="inquiry-content-title">문의 내용</div>
      <div class="inquiry-content-text">{{ inquiry.content }}</div>
    </div>

    <!-- 답변 영역 -->
    <div class="inquiry-reply-card" :class="{ 'has-reply': inquiry.reply }">
      <div class="reply-title">답변</div>
      <template v-if="inquiry.reply">
        <div class="reply-content">{{ inquiry.reply }}</div>
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

const inquiry = ref({
  id: route.params.id,
  title: '배송 문의',
  author: '이영희',
  date: '2025-06-18',
  content: '상품 배송이 언제쯤 도착할까요?',
  reply: '',
});

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
    inquiry.value.reply = replyText.value;
    replyEditText.value = replyText.value;
    replyText.value = '';
    loading.value = false;
    alert('답변이 등록되었습니다.');
  }, 800);
}

function saveEditReply() {
  if (replyEditText.value.trim().length >= minLength) {
    inquiry.value.reply = replyEditText.value;
    editReply.value = false;
    alert('답변이 수정되었습니다.');
  }
}
function deleteReply() {
  if (confirm('답변을 삭제하시겠습니까?')) {
    inquiry.value.reply = '';
    replyEditText.value = '';
    editReply.value = false;
  }
}

function goToInquiryList() {
  router.push({ name: 'ProductInquiryList', params: { productCode: route.params.productCode } });
}
</script>

<style scoped>
.inquiry-detail {
  max-width: 100%;
  margin: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 16px 24px 16px;
  position: relative;
}
.inquiry-detail-title-above {
  text-align: center;
  font-size: 1.35rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
}
.inquiry-detail-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  min-height: 48px;
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
.inquiry-info-row {
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
.inquiry-id::before {
  content: "문의번호 : #";
  color: #2563eb;
  margin-right: 4px;
}
.inquiry-title::before {
  content: "문의제목 : ";
  color: #222;
  margin-right: 4px;
}
.inquiry-author::before {
  content: "작성자 : ";
  color: #555;
  margin-right: 4px;
}
.inquiry-date::before {
  content: "등록일자 : ";
  color: #888;
  margin-right: 4px;
}
.inquiry-content-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px 16px 18px 16px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.inquiry-content-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 8px;
}
.inquiry-content-text {
  font-size: 1.2rem;
  color: #222;
  line-height: 1.7;
}
.inquiry-reply-card {
  background: #f7faff;
  border-radius: 8px;
  padding: 18px 16px 14px 16px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.05);
  border-left: 5px solid #2563eb;
  position: relative;
}
.inquiry-reply-card.has-reply {
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
  .inquiry-detail { padding: 10px 2vw; }
  .inquiry-info-row { gap: 16px; font-size: 1rem; }
}
</style>
