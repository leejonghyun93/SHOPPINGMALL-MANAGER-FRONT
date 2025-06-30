<template>
  <div class="register-wrapper">
    <h2 class="title">방송 등록</h2>
    <div class="form-grid">

      <!-- 왼쪽 영역 -->
      <div class="form-left">
        <div class="form-group">
          <label>방송자</label>
          <input type="text" v-model="broadcast.broadcaster_id" readonly />
        </div>

        <div class="form-group">
          <label>제목</label>
          <input type="text" v-model="broadcast.title" />
        </div>

        <div class="form-group">
          <label>설명</label>
          <textarea v-model="broadcast.description"></textarea>
        </div>

        <div class="form-group">
          <label>상품 등록</label>
          <div class="product-register">
            <input type="text" v-model="searchKeyword" @keyup="searchProducts" placeholder="상품명 입력" />
            <button @click="searchProducts">검색</button>
          </div>
        </div>

        <div v-if="searchResults.length">
          <ul>
            <li v-for="product in searchResults" :key="product.product_id">
              {{ product.product.name }} - {{ product.product.price }}원
              <button @click="addProduct(product)">추가</button>
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label>선택된 상품</label>
          <ul>
            <li v-for="(item, index) in broadcast.productList" :key="index">
              <img :src="item.product.mainImage" alt="상품 이미지" width="80" height="80" />
               {{ item.product.name }} - {{ item.product.price }}원
              <button @click="removeProduct(index)">삭제</button>
            </li>
          </ul>
        </div>
        
        <div class="form-group">
          <label>카테고리</label>
          <select v-model="broadcast.category_id">
            <option disabled value="">선택</option>
            <option value="1">신선식품</option>
            <option value="2">가공식품</option>
            <option value="3">음료</option>
            <option value="4">건강식품</option>
          </select>
        </div>

        
      </div>

      <!-- 오른쪽 영역 -->
      <div class="form-right">
        <div class>
          <div v-if="thumbnailPreview">
            <img :src="thumbnailPreview" alt="썸네일 미리보기" style="max-width: 200px; margin-top: 10px;" />
          </div>
          <div v-else>썸네일 사진을 업로드 해주세요</div>
        </div>
 
        <div class="form-group horizontal">
          <label>썸네일 업로드</label>
          <input type="file" @change="handleFileUpload" />
        </div>

        <div class="form-group horizontal">
          <div class="radio-group">
            <label><b>공개 여부</b></label>
            <label><input type="radio" :value="true" v-model="broadcast.is_public" /> 공개</label>
            <label><input type="radio" :value="false" v-model="broadcast.is_public" /> 비공개</label>
          </div>
        </div>

        <div class="form-group horizontal">
          <div class="radio-group">
            <!-- <label>예약 설정</label>
            <label><input type="checkbox" v-model="form.reserve" /> 예약 설정</label>
            <div class="radio-group"> -->
              <!-- <label>방송 시작 시간<input type="datetime-local" v-model="broadcast.schedule_start_time" v-if="form.reserve"/></label>
              <label>방송 종료 시간<input type="datetime-local" v-model="broadcast.schedule_end_time" v-if="form.reserve"/></label> -->
              <label>방송 시작 시간<input type="datetime-local" v-model="broadcast.schedule_start_time" /></label>
              <label>방송 종료 시간<input type="datetime-local" v-model="broadcast.schedule_end_time" /></label>
            <!-- </div> -->
          </div>
        </div>

        <div class="form-group">
          <label>OBS 서버 주소 설정 (파일>설정>방송 : 서버 주소에 해당 주소를 붙여넣어 주세요)</label>
          <input type="text" :value="rtmp_url" readonly placeholder="자동 생성 예정" />
        </div>

        <div class="form-group">
          <label>OBS 스트림 키 (파일>설정>방송 : 스트림 키에 해당 주소를 붙여넣어 주세요)</label>
          <div style="display: flex; align-items: center;">
            <input
              ref="streamKeyInput"
              :type="'text'"
              :value="broadcast.stream_key"
              readonly
              :style="showStreamKey ? '' : 'webkitTextSecurity: disc;'"
              style="flex: 1;"
            />
            <button type="button" @click="toggleStreamKey" style="margin-left: 8px;">
              {{ showStreamKey ? '🙈' : '👁️' }}
            </button>
            <button type="button" @click="copyStreamKey" style="margin-left: 8px;">
              📋
            </button>
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
import { onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()

const broadcast = reactive({
  broadcast_id: '',
  broadcaster_id: '',
  title: '',
  description: '',
  category_id: '',
  stream_url: '',
  thumbnail_url: '',
  is_public: '',
  broadcast_status: '',
  schedule_start_time: '',
  schedule_end_time: '',
  stream_key: '',
  productList: [],
})

const rtmp_url = ref('');

const thumbnailPreview = ref('') // 미리보기용 로컬 URL

const searchKeyword = ref('')
const searchResults = ref([])
const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')

const showStreamKey = ref(false)
const streamKeyInput = ref(null)


// broadcaster_id 에 로그인된 id 불러오기
const getUserId = await axios.get('/api/host/me', {
  headers: {
    'Authorization' : `Bearer ${token}`
  }
})
broadcast.broadcaster_id = getUserId.data.user_id

// 방송 등록
const submitForm = async () => {
  if (!confirm("방송을 등록하시겠습니까?")) return;

  try{
    const formData = new FormData()

    formData.append('broadcast', new Blob([JSON.stringify(toRaw(broadcast))], {
      type: 'application/json'
    }))
    console.log(toRaw(broadcast))
    formData.append('productList', new Blob([JSON.stringify(broadcast.productList)], {
      type: 'application/json'
    }))

    const res = await axios.post('/api/broadcast/register', formData, {
      headers : {
        'Content-Type' : 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    })
    const responseData = res.data
    console.log(token)

    Object.assign(broadcast, responseData.broadcast);  // broadcast 전체 덮어쓰기 대신 병합
    broadcast.stream_key = responseData.stream_key
    rtmp_url.value = responseData.rtmp_url
    broadcast.stream_url = responseData.stream_url

    if(responseData.status === "error"){
      alert(responseData.error)
    } else {
      alert('방송 등록 완료!')
      // router.push(`/broadcast/{broadcast.broadcast_id}`)
     
      const broadcastUrl = `/broadcast/${broadcast.broadcast_id}`
      window.open(broadcastUrl, '_blank', 'width=1500,height=900,resizable=yes')
    }

  }catch(error){
    alert('방송 등록 실패 '  + (error.response?.data?.message || error.message))
  }
}

// 상품명 검색
const searchProducts = async () => {
  const keyword = searchKeyword.value.trim()

  if(!keyword){
    searchResults.value = []
    return
  }

  try {
    const res = await axios.get('/api/broadcast/product/search', {
      params: { 
        keyword: keyword
      }
    })
    
    searchResults.value = res.data
    console.log("🔍 searchResults =", searchResults)
  } catch(error) {
    console.error("상품 검색 실패 : ", error)
    searchResults.value = []
  }
}

// 상품 추가
const addProduct = (product) => {
  const exists = broadcast.productList.some(p => p.product_id === product.product.productId)
  console.log("👉 현재 추가할 product_id:", product.product.productId);
  if(!exists){
    broadcast.productList.push({
      product_id: product.product.productId,
      product: {
        name: product.product.name,
        price: product.product.price,
        mainImage: product.product.mainImage || '',
      }
    })
    console.log("선택된 product_id:", product.product_id)
  }
}

// 상품 삭제
const removeProduct = (index) => {
  broadcast.productList.splice(index, 1)
}

// 파일 업로드 메소드
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return;

  const formData = new FormData()
  formData.append("file", file)
  
  try {
    const res = await axios.post("/api/broadcast/uploads/thumbnail", formData, {
      headers: {
        'Content-Type' : 'multipart/form-data'
      }
    })
    const { url } = res.data
    thumbnailPreview.value = `http://localhost:8080${url}`
    broadcast.thumbnail_url = res.data.url // 서버가 url 반환

    console.log('preview URL:', thumbnailPreview.value)
  } catch(error){
    console.error("썸네일 업로드 실패: ", error)
    alert("썸네일 업로드 실패")
  }
}

// 방송 스트림 url, key 가져오기
const initBroadcastInfo = async () => {
  try {
    const res = await axios.get('/api/broadcast/init', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = res.data
    broadcast.stream_key = data.stream_key
    broadcast.stream_url = data.stream_url
    rtmp_url.value = data.rtmp_url  // 필요 시
  } catch (error) {
    console.error('초기 방송 키/URL 생성 실패:', error)
  }
}

// 스트림 키 보여주기
const toggleStreamKey = () => {
  showStreamKey.value = !showStreamKey.value
}

// 스트림 키 복사
const copyStreamKey = async () => {
  try {
    await navigator.clipboard.writeText(broadcast.stream_key)
    alert('스트림 키 복사 완료!')
  } catch (err) {
    alert('복사 실패')
  }
}

onMounted(() => {
  initBroadcastInfo()
  searchProducts()
})
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

.product-register {
  display: flex;
  align-items: center;
  gap: 10px; /* input과 버튼 사이 간격 */
}

.product-register input[type="text"] {
  flex: 1;
  min-width: 0; /* input이 너무 커져서 줄바꿈 되는 현상 방지 */
  padding: 10px;
  font-size: 14px;
}

.product-register button {
  padding: 10px 16px;
  font-size: 14px;
  white-space: nowrap; /* 줄바꿈 방지 */
  background-color: #2b65c0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.product-register button:hover {
  background-color: #1e4da8;
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