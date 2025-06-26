<template>
  <div class="register-wrapper">
    <h2 class="title">방송 등록</h2>
    <div class="form-grid">

      <!-- 왼쪽 영역 -->
      <div class="form-left">
        <div class="form-group">
          <label>방송자</label>
          <input type="text" value="이름(dongjin)" readonly />
        </div>

        <div class="form-group">
          <label>제목</label>
          <input type="text" v-model="form.title" />
        </div>

        <div class="form-group">
          <label>설명</label>
          <textarea v-model="form.description"></textarea>
        </div>

        <div class="form-group">
          <label>상품 등록</label>
          <textarea v-model="form.products" placeholder="상품명 나열 또는 선택 구현 예정"></textarea>
        </div>

        <div class="form-group">
          <label>카테고리</label>
          <select v-model="form.category">
            <option disabled value="">선택</option>
            <option>패션</option>
            <option>식품</option>
            <option>생활용품</option>
          </select>
        </div>

        <div class="form-group">
          <label>방송키(URL 생성)</label>
          <input type="text" v-model="form.streamKey" readonly placeholder="자동 생성 예정" />
        </div>
      </div>

      <!-- 오른쪽 영역 -->
      <div class="form-right">
        <div class="thumbnail-box">
          <p>썸네일 사진<br />(없으면 영상 그대로 송출)</p>
        </div>

        <div class="form-group horizontal">
          <label>썸네일 업로드</label>
          <input type="file" @change="handleFileUpload" />
        </div>

        <div class="form-group horizontal">
          <div class="radio-group">
            <label><b>공개 여부</b></label>
            <label><input type="radio" value="public" v-model="form.visibility" /> 공개</label>
            <label><input type="radio" value="private" v-model="form.visibility" /> 비공개</label>
          </div>
        </div>

        <div class="form-group horizontal">
          <div class="radio-group">
            <label>예약 설정</label>
            <label><input type="checkbox" v-model="form.reserve" /> 예약 설정</label>
            <input type="datetime-local" v-model="form.scheduledTime" v-if="form.reserve"/>
          </div>
        </div>
      </div>

    </div>

    <div class="btn-wrap">
      <button @click="submitForm">방송 등록</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
  title: '',
  description: '',
  products: '',
  category: '',
  visibility: 'public',
  reserve: false,
  scheduledTime: '',
  streamKey: 'stream-dongjin-abcdefg'
})

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    alert(`선택된 파일: ${file.name}`)
  }
}

const submitForm = () => {
  if (!confirm("방송을 등록하시겠습니까?")) return;


  router.push('/broadcast/start')
  console.log('등록된 값:', form.value)
  alert('방송 등록 완료!')
}
</script>

<style scoped>
/* 전체 레이아웃 */
.register-wrapper {
  font-family: 'Noto Sans KR', sans-serif;
  width: 100%;
  flex: 1;
  padding: 0;
  margin: 0;
  min-height: 100%;
  box-sizing: border-box;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

/* 그리드 */
.form-grid {
  display: flex;
  gap: 40px;
}

.form-left, .form-right {
  flex: 1;
}

/* 공통 폼 스타일 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

input[type="text"],
input[type="datetime-local"],
input[type="file"],
textarea,
select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  color: #111;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: #a0a0a0;
  font-size: 13px;
}

/* select 화살표 커스텀 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%23333' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  padding-right: 36px;
}

/* 수평 정렬 그룹 (공개/예약) */
.form-group.horizontal {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-group.horizontal label {
  margin-bottom: 0;
  font-weight: normal;
}

/* 썸네일 미리보기 박스 */
.thumbnail-box {
  background-color: #0d5e7e;
  color: #fff;
  height: 160px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: 20px;
  border: 1px solid #336699;
  border-radius: 6px;
}

/* 버튼 영역 */
.btn-wrap {
  text-align: right;
  margin-top: 30px;
}

.btn-wrap button {
  background-color: #2b65c0;
  color: white;
  padding: 10px 30px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-wrap button:hover {
  background-color: #1e4da8;
}

.radio-group {
  display: flex;
  gap: 10px;
}
</style>