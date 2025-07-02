<template>
  <div class="broadcast-page">
    <!-- 전체를 좌우 섹션으로 나눔 -->
    <div class="main-content">
      <!-- 왼쪽: 방송 영상, 정보, 시작/중지/일시정지 버튼 -->
      <div class="left-section">
        <div class="video-section">
          <!-- <video id="broadcastVideo" autoplay muted controls></video> -->
          <video ref="videoRef" controls autoplay muted ></video>
        </div>

        <div class="info-section">
          <h2>{{ broadcast.title }}</h2>
          <p>방송자: {{ broadcast.broadcaster_id }}</p>
          <p>{{ broadcast.description }}</p>
        </div>

        <div class="control-buttons">
          <button @click="startBroadcast">방송 시작</button>
          <button @click="stopBroadcast">방송 중지</button>
        </div>
      </div>

      <!-- 오른쪽: 시청자, 상품, 채팅, 송출/종료/나가기 버튼 -->
      <div class="right-section">
        <!-- <div class="viewer-info">
          <div>시청자 수: {{ broadcast.total_viewers}}</div>
          <ul>
            <li v-for="viewer in broadcast.viewerList" 
            :key="broadcast.viewerList.viewer_id">
            {{ viewer.username }}</li>
          </ul> -->

          <!-- <table class="viewer-table">
            <thead>
              <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>입장 시간</th>
                <th>시청 시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="viewer in broadcast.viewerList" :key="viewer.user_id">
                <td>{{ viewer.user_id }}</td>
                <td>{{ viewer.username }}</td>
                <td>{{ viewer.joined_at }}</td>
                <td>{{ viewer.watch_duration }}초</td>
              </tr>
            </tbody>
          </table> 
        </div> -->

        <div class="viewer-info">
          <div class="viewer-count-badge">
            <svg xmlns="http://www.w3.org/2000/svg" class="viewer-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
              <circle cx="12" cy="12" r="2.5" fill="#fff"/>
            </svg>
            <span class="viewer-count">{{ broadcast.total_viewers }}명 시청 중</span>
          </div>
        </div>

        <!-- <div class="product-list">
          <h3>상품 목록</h3>
          <ul>
            <li v-for="(product, index) in broadcast.productList" :key="index">
              {{ product.product.name }} - {{ product.product.price }}원
            </li>
          </ul>
        </div> -->

        <div class="product-list">
          <div class="product-header" @click="toggleProductList">
            <h3>상품 목록</h3>
            <button class="toggle-button">{{ showProducts ? '접기 ▲' : '펼치기 ▼' }}</button>
          </div>

          <table v-if="showProducts" class="product-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>상품명</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in broadcast.productList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ product.product.name }}</td>
                <td>{{ product.product.price.toLocaleString() }}원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- <div class="chat-box">
          <h3>실시간 채팅</h3>
          <div class="chat-messages">
            <div v-for="(chat, index) in chatMessages" :key="index" class="chat-message">
              <strong>{{ chat.user }}:</strong> {{ chat.message }}
            </div>
          </div>
          <input
            type="text"
            v-model="chatInput"
            placeholder="채팅을 입력하세요..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">전송</button>
        </div> -->

        <div class="chat-box">
          <div class="chat-header" @click="toggleChatBox">
            <h3>실시간 채팅</h3>
            <button class="toggle-button">{{ showChat ? '접기 ▲' : '펼치기 ▼' }}</button>
          </div>

          <!-- ✅ 전체 chat-content를 통째로 접었다 폈다 -->
          <div v-if="showChat" class="chat-body">
            <div class="chat-messages">
              <div
                v-for="(chat, index) in chatMessages"
                :key="index"
                class="chat-message"
              >
                <strong>{{ chat.user }}:</strong> {{ chat.message }}
              </div>
            </div>

            <input
              type="text"
              v-model="chatInput"
              placeholder="채팅을 입력하세요..."
              @keyup.enter="sendMessage"
            />
            <button @click="sendMessage">전송</button>
          </div>
        </div>

        <!-- 오른쪽 버튼 -->
        <div class="right-buttons">
          <div class="horizontal-buttons">
            <button @click="sendToBroadcast">방송 송출</button>
            <button @click="exitBroadcast">방송 종료</button>
          </div>
          <button class="exit-btn" @click="exitPage">나가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import OBSWebSocket from 'obs-websocket-js'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Hls from 'hls.js'

const obs = new OBSWebSocket()
const viewerCount = ref(30)

const broadcast = reactive({
  broadcast_id: '',
  broadcaster_id: '',
  title: '',
  description: '',
  stream_url: '',
  total_viewers: '',
  like_count: '',
  scheduled_start_time: '',
	scheduled_end_time: '',
  productList: [],
  viewerList: [],
})

const showProducts = ref(true)
const showChat = ref(true)

const chatInput = ref('')
const chatMessages = ref([])

const router = useRouter()
const route = useRoute()

const token = ref(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'))

const videoRef = ref(null)

const toggleProductList = () => {
  showProducts.value = !showProducts.value
}

const toggleChatBox = () => {
  showChat.value = !showChat.value
}

const sendMessage = () => {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ user: '나', message: chatInput.value.trim() })
  chatInput.value = ''
}


const getBroadCasts = async () => {
  if (!broadcast.broadcast_id) {
    console.warn("⛔ broadcast_id가 없습니다:", broadcast.broadcast_id)
    return
  }
  try{
    const response = await axios.get(`/api/broadcast/${broadcast.broadcast_id}`)
    
    console.log("✅ response.data:", response.data)
    
    Object.assign(broadcast, response.data)
    console.log(broadcast)
    console.log(broadcast.stream_url)

    playStream()
  } catch(error){
    alert('데이터를 불러오는데 실패했습니다.')
  }
}

// const connectOBS = async () => {
//   try {
//     await obs.connect('ws://localhost:4455')
//   } catch (error) {
//     console.error('OBS 연결 실패:', error)
//   }
// }

const playStream = () => {
  const hlsUrl = broadcast.stream_url
  console.log(broadcast.stream_url)
  if (Hls.isSupported()) {
    const hls = new Hls({
      liveSyncDuration: 1,
      liveMaxLatencyDuration: 2,
      enableWorker: true,
      lowLatencyMode: true
    })
    hls.loadSource(hlsUrl)
    hls.attachMedia(videoRef.value)
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = hlsUrl
  }
}

const startBroadcast = async () => {

  console.log("✅ 요청 전에 broadcast_id 확인:", broadcast.broadcast_id);
  console.log("✅ 요청 전에 token 확인:", token);

  try {
    const res = await axios.post(`/api/broadcast/start`, {
      broadcast_id: broadcast.broadcast_id
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    console.log("✅ 요청 후에 token 확인:", token);

    if (res.data.status === 'success') {
      alert("방송이 시작되었습니다!");
      // 필요한 경우 스트림 URL 새로고침
      
      broadcast.stream_url = res.data.stream_url;
    } else {
      alert("방송 시작 실패: " + res.data.message);
      
    }
  } catch (e) {
    console.error(e);
    alert("서버 오류로 방송 시작에 실패했습니다.");
    console.error("❌ 요청 실패:", e);
    console.error("📛 에러 메시지:", e.message);
    console.error("📛 응답:", e.response);
  }
};

// const stopBroadcast = async () => {
//   try {
//     await obs.call('StopStreaming')
//     console.log('방송 중지됨')
//   } catch (error) {
//     console.error('중지 실패:', error)
//   }
// }

const stopBroadcast = async () => {

  try {
    const res = await axios.post(`/api/broadcast/stop`, {
      broadcast_id: broadcast.broadcast_id
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    console.log("✅ 요청 후에 token 확인:", token);

    if (res.data.status === 'success') {
      alert("방송이 중지되었습니다!");
      // 필요한 경우 스트림 URL 새로고침
      
      broadcast.stream_url = res.data.stream_url;
    } else {
      alert("방송 시작 실패: " + res.data.message);
      
    }
  } catch (e) {
    console.error(e);
    alert("서버 오류로 방송 시작에 실패했습니다.");
    console.error("❌ 요청 실패:", e);
    console.error("📛 에러 메시지:", e.message);
    console.error("📛 응답:", e.response);
  }
};

const sendToBroadcast = () => {
  alert('방송 송출 기능 연결 예정')
}

const exitBroadcast = () => {
  alert('방송 종료 처리 예정')
}

const exitPage = () => {
  router.push('/')
}

onMounted(() => {
  broadcast.broadcast_id = parseInt(route.params.broadcast_id)
  console.log("route.params.broadcast_id:", route.params.broadcast_id)
  getBroadCasts()
})
</script>

<style scoped>
.broadcast-page {
  padding: 24px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  background-color: #f5f6fa;
  min-height: 100vh;
}

.main-content {
  display: flex;
  gap: 24px;
}

/* 좌측: 방송 영상, 정보, 제어 버튼 */
.left-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-section video {
  width: 100%;
  height: 550px;
  background: #000;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-section h2 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #2c3e50;
}

.info-section p {
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.control-buttons button {
  flex: 1;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-buttons button:hover {
  background-color: #2980b9;
}

/* 우측: 시청자, 상품, 채팅, 제어 */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
}

.viewer-info {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-count-badge {
  display: flex;
  align-items: center;
  background-color: #ecf0f1;
  padding: 8px 14px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.05);
}

.viewer-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: #2980b9;
}

/*.viewer-info,*/
/* .product-list, */
/* .chat-box {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #333;
} */

.product-list {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.toggle-button {
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.product-table th {
  background-color: #f0f3f5;
  color: #2c3e50;
}

/* 상품 리스트 */
/* .product-list ul {
  padding-left: 16px;
}

.product-list li {
  margin-bottom: 6px;
} */

/* 채팅 */
/* .chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 300px;
} */

.chat-box {
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.chat-body {
  display: flex;
  flex-direction: column;
  height: 300px; /* 고정 높이 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: white;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.chat-message {
  margin-bottom: 6px;
}

.chat-box input {
  margin-top: 6px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

.chat-box button {
  margin-top: 6px;
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-box button:hover {
  background-color: #27ae60;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.toggle-button {
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 방송 제어 버튼 */
.right-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-buttons .horizontal-buttons {
  display: flex;
  gap: 10px;
}

.right-buttons button {
  flex: 1;
  padding: 12px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 송출/종료 버튼 */
.right-buttons .horizontal-buttons button:first-child {
  background-color: #f39c12;
  color: white;
}

.right-buttons .horizontal-buttons button:first-child:hover {
  background-color: #d68910;
}

.right-buttons .horizontal-buttons button:last-child {
  background-color: #e74c3c;
  color: white;
}

.right-buttons .horizontal-buttons button:last-child:hover {
  background-color: #c0392b;
}

/* 나가기 버튼 */
.exit-btn {
  background-color: #95a5a6;
  color: white;
}

.exit-btn:hover {
  background-color: #7f8c8d;
}

</style>