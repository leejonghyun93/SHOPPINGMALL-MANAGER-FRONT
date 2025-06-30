<template>
  <ChatCommon ref="chatRef" :broadcastId="broadcastId" />

  <div class="pinned-tools">
    <input v-model="pinnedText" placeholder="고정할 메세지를 입력하세요" />
    <button @click="sendPinned">📌 고정</button>
    <button @click="clearPinned">❌ 해제</button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import ChatCommon from './ChatCommon.vue';

const route = useRoute();
const broadcastId = Number(route.params.broadcastId);

const pinnedText = ref('');
const chatRef = ref(null);

// 고정 메시지 전송
const sendPinned = () => {
  console.log('chatRef:', chatRef.value);
  chatRef.value?.sendPinnedMessage(pinnedText.value);
};

// 고정 메시지 해제 → 빈 텍스트 전송
const clearPinned = () => {
  chatRef.value?.sendPinnedMessage('');
};
</script>

<style scoped>
.pinned-tools {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 6px;
}
</style>
