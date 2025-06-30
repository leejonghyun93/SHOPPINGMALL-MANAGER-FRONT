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
          <button @click="pauseBroadcast">방송 일시정지</button>
        </div>
      </div>

      <!-- 오른쪽: 시청자, 상품, 채팅, 송출/종료/나가기 버튼 -->
      <div class="right-section">
        <div class="viewer-info">
          <div>시청자 수: {{ viewerCount }}</div>
          <ul>
            <li v-for="viewer in viewers" :key="viewer.id">{{ viewer.name }}</li>
          </ul>
        </div>

        <div class="product-list">
          <h3>상품 목록</h3>
          <ul>
            <li v-for="(product, index) in products" :key="index">
              {{ product.name }} - {{ product.price }}원
            </li>
          </ul>
        </div>

        <div class="chat-box">
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
const viewers = ref([
  { id: 1, name: '시청자1' },
  { id: 2, name: '시청자2' },
])

const products = reactive({
  productId: '',
  name: '',
  price: '',
  mainImage: '',
})

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
})


const chatInput = ref('')
const chatMessages = ref([])

const router = useRouter()
const route = useRoute()

const token = ref(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'))

const videoRef = ref(null)

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
    // Object.assign(products, response.data)
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

const pauseBroadcast = async () => {
  try {
    await obs.call('TogglePauseStreaming')
    console.log('방송 일시정지/재개')
  } catch (error) {
    console.error('일시정지 실패:', error)
  }
}

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
  padding: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.left-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
}

.video-section video {
  width: 100%;
  height: 550px;
  background: black;
  border-radius: 8px;
}

.info-section {
  background: #f2f2f2;
  padding: 20px;
  border-radius: 12px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.right-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-buttons .horizontal-buttons {
  display: flex;
  gap: 10px;
}

.viewer-info,
.product-list,
.chat-box {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 300px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: white;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  border-radius: 5px;
}

.chat-message {
  margin-bottom: 4px;
}
</style>