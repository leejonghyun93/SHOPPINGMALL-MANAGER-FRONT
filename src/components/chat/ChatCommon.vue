<template>
  <div class="chat-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-text">채팅 준비 중...</div>
    </div>
    <div class="pinned-banner" v-if="pinnedMessage">
      📌 {{ pinnedMessage }}
    </div>
    <div v-else class="chat-messages" ref="messagesContainer" @scroll="handleScroll">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-message', msg.systemOnly ? 'system-message' : (isMyMessage(msg) ? 'my-message' : 'other-message')]"
      >
        <template v-if="msg.systemOnly">
          <div class="system-box">{{ msg.text }}</div>
        </template>
        <template v-else>
          <div class="chat-line">
            <template v-if="!isMyMessage(msg)">
              <div class="nickname">{{ msg.from }}</div>
            </template>
            <div class="bubble">
              <img v-if="msg.type === 'sticker'" :src="stickerMap[msg.text]" class="chat-sticker" />
              <span v-else class="chat-content">{{ msg.text }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showScrollToBottom" class="scroll-to-bottom" @click="scrollToBottom">
      최근 메시지로 이동
    </div>

    <div class="chat-input">
      <input
        ref="inputRef"
        v-model="newMessage"
        @focus="handleInputFocus"
        @keyup.enter="sendMessage"
        :placeholder="isLoggedIn.value ? '메시지를 입력하세요' : '메세지 입력은 로그인 후 가능합니다.'"
      />
      <button @click="sendMessage">전송</button>
      <button @click="toggleTools" class="tools-toggle">🤸‍♂️</button>
    </div>

    <div v-if="showTools" class="chat-tools">
      <div class="tools-header">
        <div class="tab-buttons">
          <button :class="{ active: activeTab === 'bear' }" @click="activeTab = 'bear'">🐻</button>
          <button :class="{ active: activeTab === 'rabbit' }" @click="activeTab = 'rabbit'">🐰</button>
        </div>
      </div>
      <div class="sticker-list">
        <img
          v-for="(src, key) in filteredStickers"
          :key="key"
          :src="src"
          class="sticker-item"
          @click="() => sendSticker(key)"
        />
      </div>
    </div>

    <div v-if="showLoginModal" class="login-popup-overlay">
      <div class="login-popup">
        <p>로그인 후 채팅이 가능합니다.</p>
        <div class="popup-buttons">
          <button @click="goToLogin">로그인 하고 채팅 참여하기</button>
          <button @click="showLoginModal = false">로그인 없이 방송 시청하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed, defineExpose } from 'vue';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { stickerMap } from './EmojiMap';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { userState } from './UserState';

const props = defineProps({
  broadcastId: Number,
  role: { type: String, default: 'user' } // future use
});

const pinnedMessage = ref('');
const router = useRouter();
const isLoggedIn = ref(false);
const showLoginModal = ref(false);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const inputRef = ref(null);
const showTools = ref(false);
const showScrollToBottom = ref(false);
const loading = ref(true);
const activeTab = ref('bear');

const normalize = str => String(str || '').trim();
const isMyMessage = msg => normalize(msg.from) === normalize(userState.currentUser);

const filteredStickers = computed(() => {
  return Object.fromEntries(
    Object.entries(stickerMap).filter(([key]) => key.startsWith(activeTab.value))
  );
});

const socket = new SockJS('http://localhost:8080/ws-chat');
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
  onConnect: () => {
    messages.value.push({ text: '채팅방에 입장하셨습니다.', systemOnly: true });
    stompClient.subscribe('/topic/public', msg => {
      const received = JSON.parse(msg.body);

      if (received.type === 'pinned') {
      pinnedMessage.value = received.text;
      return;
      }

      messages.value.push(received);

      nextTick(() => {
        isScrolledToBottom() ? scrollToBottom() : (showScrollToBottom.value = true);
      });
    });
  }
});

onMounted(async () => {
  stompClient.activate();
  try {
    const res = await axios.get(`/api/chat/history/${props.broadcastId}`);
    messages.value.push(...res.data);
  } catch (err) {
    console.error('❌ 채팅 기록 조회 실패:', err);
  }

  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  if (token) {
    try {
      const res = await axios.get('/api/members/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      userState.currentUser = res.data.nickname;
      userState.userId = res.data.userId;
      isLoggedIn.value = true;
    } catch (err) {
      console.warn('❌ 사용자 정보 조회 실패 (토큰 만료 등):', err);
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('jwt');
    }
  }
  loading.value = false;
  scrollToBottom();
});

const sendMessage = () => {
  if (!isLoggedIn.value || newMessage.value.trim() === '' || !stompClient.connected) return;
  const payload = {
    from: userState.currentUser,
    text: newMessage.value,
    type: 'text',
    broadcastId: props.broadcastId,
    userId: userState.userId
  };
  stompClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(payload) });
  newMessage.value = '';
  focusInput();
  scrollToBottom();
};

const sendSticker = key => {
  if (!isLoggedIn.value || !stompClient.connected) return;
  const payload = {
    from: userState.currentUser,
    type: 'sticker',
    text: key,
    broadcastId: props.broadcastId,
    userId: userState.userId
  };
  stompClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(payload) });
  focusInput();
  scrollToBottom();
};

const sendPinnedMessage = (text) => {
  if (!text.trim() || !stompClient.connected) return;

  const payload = {
    type: 'pinned',
    text,
    broadcastId: props.broadcastId,
    from: userState.currentUser,
    userId: userState.userId
  };

  stompClient.publish({
    destination: '/app/sendMessage',
    body: JSON.stringify(payload)
  });
};

const focusInput = () => nextTick(() => inputRef.value?.focus());
const scrollToBottom = () => {
  nextTick(() => {
    const el = messagesContainer.value;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      showScrollToBottom.value = false;
    }
  });
};
const isScrolledToBottom = (threshold = 200) => {
  const el = messagesContainer.value;
  return !el || el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
};
const handleScroll = () => { showScrollToBottom.value = !isScrolledToBottom(200); };
const toggleTools = () => { showTools.value = !showTools.value; focusInput(); };
const goToLogin = () => router.push('/login');
const handleInputFocus = e => {
  if (!isLoggedIn.value) {
    e.target.blur();
    showLoginModal.value = true;
  }
};

defineExpose({sendPinnedMessage});
</script>

<style scoped>
.chat-container { height: 400px; width: 320px; display: flex; flex-direction: column; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); background: #fff; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); overflow: hidden; }
.chat-messages { flex: 1; overflow-y: auto; padding: 6px; font-size: 13px; background: #f9f9f9; }
.chat-input { display: flex; padding: 4px; border-top: 1px solid #ccc; background: #fff; }
.chat-input input { flex: 1; padding: 4px 6px; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; }
.chat-input button { margin-left: 4px; padding: 4px 8px; font-size: 13px; cursor: pointer; border: none; background-color: #3b82f6; color: white; border-radius: 4px; }
.tools-toggle { padding: 4px 6px; background: transparent; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
.chat-message { margin-bottom: 6px; display: flex; flex-direction: column; align-items: flex-start; }
.my-message { align-items: flex-end; }
.chat-bubble { max-width: 80%; padding: 6px 10px; border-radius: 12px; background: #e6e6e6; line-height: 1.4; word-break: break-word; }
.my-message .chat-bubble { background: #3b82f6; color: white; }
.chat-content { white-space: pre-wrap; }
.chat-sticker { width: 60px; height: 60px; object-fit: contain; border-radius: 6px; margin-top: 4px; }
.system-box { background-color: #e0e0e0; color: #555; font-size: 12px; padding: 4px 8px; border-radius: 4px; text-align: center; margin: 6px auto; }
.chat-tools { border-top: 1px solid #eee; background: #fff; padding: 4px; }
.sticker-tabs { display: flex; gap: 4px; margin-bottom: 4px; }
.sticker-tabs button { flex: 1; padding: 4px 0; border: 1px solid #ccc; background: #f0f0f0; cursor: pointer; border-radius: 4px; font-size: 14px; }
.sticker-tabs .active { background: #3b82f6; color: white; }
.sticker-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 140px; overflow-y: auto; }
.sticker-item { width: 60px; height: 60px; cursor: pointer; border-radius: 6px; object-fit: contain; }
.scroll-to-bottom { background: #3b82f6; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px; cursor: pointer; text-align: center; margin: 4px auto; width: fit-content; opacity: 0.8; }
.login-popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; }
.login-popup { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center; }
.popup-buttons { margin-top: 12px; display: flex; gap: 10px; justify-content: center; }
.popup-buttons button { padding: 8px 14px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.popup-buttons button:first-child { background-color: #3b82f6; color: white; }
.popup-buttons button:last-child { background-color: #eee; color: #333; }
.loading-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.8); z-index: 100; }
.loading-text { font-size: 16px; color: #555; }
.nickname { font-size: 12px; color: #888; margin-bottom: 2px;}
.bubble { background-color: #f0f0f0; border-radius: 12px; padding: 6px 10px; max-width: 80%; word-break: break-word; line-height: 1.4;}
.my-message .bubble { background-color: #d8ecff; align-self: flex-end;}
.other-message .bubble { background-color: #eeeeee; align-self: flex-start;}
.pinned-banner {
  background: #fff8dc;
  color: #333;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  text-align: center;
}
</style>