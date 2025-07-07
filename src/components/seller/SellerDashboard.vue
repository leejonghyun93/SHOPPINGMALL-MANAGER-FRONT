<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import SummaryCardOrder from './dashboard/SummaryCardOrder.vue'
import SummaryCardProduct from './dashboard/SummaryCardProduct.vue'
import SummaryCardRefund from './dashboard/SummaryCardRefund.vue'
import ReviewCard from './dashboard/ReviewCard.vue'
import PopularProductCard from './dashboard/PopularProductCard.vue'
import RecentInquiry from './dashboard/RecentInquiry.vue'
import StockWarningCard from './dashboard/StockWarningCard.vue'

const paid = ref(0)
const preparing = ref(0)
const delivering = ref(0)
const onSale = ref(0)
const offSale = ref(0)
const outOfStock = ref(0)
const cancel = ref(0)
const returnCount = ref(0)
const exchange = ref(0)

onMounted(async () => {
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')
  if (!token) return

  try {
    const response = await axios.get('/api/dashboard/order-status', {
      headers: { authorization: `Bearer ${token}` }
    })
    const data = response.data

    paid.value = data.paid
    preparing.value = data.preparing
    delivering.value = data.delivering
    cancel.value = data.cancelled
    returnCount.value = data.returnRequested
    exchange.value = data.exchangeRequested
  } catch (e) {
    console.error('주문 상태 조회 실패:', e)
  }
})
</script>

<template>
  <div class="dashboard-grid">
    <div class="card-group" style="grid-area: cards">
      <SummaryCardOrder :paid="paid" :preparing="preparing" :delivering="delivering" />
      <SummaryCardProduct :onSale="12" :offSale="4" :outOfStock="2" />
      <SummaryCardRefund :cancel="cancel" :returnCount="returnCount" :exchange="exchange" />
    </div>

    <div class="graph">📊 그래프</div>

    <div class="review-section">
      <ReviewCard />
    </div>

    <div class="popular-section">
      <PopularProductCard />
    </div>

    <div class="bottom-widgets">
      <RecentInquiry />
      <StockWarningCard />
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 3fr 1.2fr;
  grid-template-rows: auto auto auto auto;
  gap: 1rem;
  padding: 0.5rem 1rem 1rem 1rem; /* 상단 여백 더 줄임 */
  grid-template-areas:
    "cards           review-section"
    "graph           review-section"
    "graph           popular-section"
    "bottom-widgets  popular-section";
  box-sizing: border-box;
}

.card-group {
  display: flex;
  gap: 1rem;
  grid-area: cards;
}
.card-group > * {
  flex: 1;
}

.graph {
  grid-area: graph;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-height: 300px;
}

.review-section {
  grid-area: review-section;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  min-height: 400px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.popular-section {
  grid-area: popular-section;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  min-height: 250px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.bottom-widgets {
  grid-area: bottom-widgets;
  display: flex;
  gap: 1rem;
}
.bottom-widgets > * {
  flex: 1;
}
</style>
