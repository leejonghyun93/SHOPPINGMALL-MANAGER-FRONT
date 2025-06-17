<template>
  <div class="order-wrapper">
    <!-- 상태 요약 -->
    <div class="status-summary">
      <div class="status-box">결제완료<br />{{ summary.paid }}건</div>
      <div class="status-box">배송준비중<br />{{ summary.ready }}건</div>
      <div class="status-box">배송중<br />{{ summary.shipping }}건</div>
    </div>

    <!-- 필터 -->
    <div class="order-filters">
      <label>시작일 <input type="date" v-model="startDate" /> </label>
      <label>종료일 <input type="date" v-model="endDate" /> </label>
    </div>
    <div class="order-filters">
      <input type="text" v-model="searchOrderNo" placeholder="주문번호" />
      <button @click="searchOrders">검색</button>
      <select v-model="sortOption">
        <option value="latest">최신순</option>
        <option value="oldest">과거순</option>
      </select>
    </div>

    <!-- 테이블 -->
    <table class="order-table">
      <thead>
        <tr>
          <th>체크</th>
          <th>주문번호</th>
          <th>주문자명</th>
          <th>연락처</th>
          <th>주문일시</th>
          <th>주문상태</th>
          <th>배송상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.orderNo">
          <td><input type="checkbox" v-model="selectedOrders" :value="order.orderNo" /></td>
          <td>{{ order.orderNo }}</td>
          <td><a>{{ order.name }}</a></td>
          <td>{{ order.phone }}</td>
          <td>{{ order.date }}</td>
          <td>{{ order.orderStatus }}</td>
          <td>{{ order.deliveryStatus }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">이전</button>
      <button class="active">{{ currentPage }}</button>
      <button :disabled="!hasNextPage" @click="currentPage++">다음</button>
    </div>

    <!-- 상태변경 버튼 -->
    <div class="status-action-buttons">
      <button @click="changeOrderStatus">주문상태 변경</button>
      <button @click="changeDeliveryStatus">배송상태 변경</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const summary = ref({
  paid: 1,
  ready: 1,
  shipping: 1,
})

const orders = ref([
  {
    orderNo: '1920300',
    name: '홍길동',
    phone: '010-1234-1234',
    date: '2025-06-05',
    orderStatus: 'Y',
    deliveryStatus: 'Y',
  },
  // 필요한 만큼 추가
])

const searchOrderNo = ref('')
const sortOption = ref('latest')
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const selectedOrders = ref([])

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchOrderNo.value) {
    filtered = filtered.filter(o => o.orderNo.includes(searchOrderNo.value))
  }

  if (startDate.value) {
    filtered = filtered.filter(o => o.date >= startDate.value)
  }
  if (endDate.value) {
    filtered = filtered.filter(o => o.date <= endDate.value)
  }

  if (sortOption.value === 'latest') {
    filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  } else {
    filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date))
  }

  return filtered
})

const hasNextPage = computed(() => {
  return false // 추후 페이지네이션 구현 시 변경
})

const searchOrders = () => {
  currentPage.value = 1
}

const changeOrderStatus = () => {
  alert('주문 상태 변경 대상: ' + selectedOrders.value.join(', '))
}

const changeDeliveryStatus = () => {
  alert('배송 상태 변경 대상: ' + selectedOrders.value.join(', '))
}
</script>

<style scoped src="@/assets/order.css"></style>