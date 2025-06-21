<template>
  <div class="rounded-order-page">
    <!-- 상단 -->
    <div class="page-title">
      <h2>전체 주문</h2>
    </div>

    <!-- 검색 섹션 -->
    <div class="rounded-search-bar">
      <select><option>전체</option></select>
      <input type="text" placeholder="검색어 입력" />
      <button class="search-btn">🔍</button>
      <button class="detail-toggle" @click="showDetail = !showDetail">
        {{ showDetail ? '▲ 상세검색 닫기' : '+ 상세검색' }}
      </button>
    </div>

    <!-- 상세 검색 -->
    <transition name="fade">
      <div v-if="showDetail" class="detail-box">
        <h4>Search</h4>

        <table class="detail-table">
          <tbody>
            <tr>
              <th>주문일</th>
              <td colspan="5">
                <input type="date" />
                <span> - </span>
                <input type="date" />
                <!-- <div class="quick-range"> -->
                  <button>오늘</button>
                  <button>1주일</button>
                  <button>1개월</button>
                  <button>3개월</button>
                  <button>6개월</button>
                  <button>1년</button>
                <!-- </div> -->
              </td>
            </tr>
            <tr>
              <th>진행상태</th>
              <td colspan="5">
                <!-- <label><input type="checkbox" /> 결제대기</label> -->
                <label><input type="checkbox" /> 결제완료</label>
                <label><input type="checkbox" /> 배송준비</label>
                <label><input type="checkbox" /> 배송중</label>
                <label><input type="checkbox" /> 배송완료</label>
                <label><input type="checkbox" /> 환불요청</label>
              </td>
            </tr>
            <tr>
              <th>결제수단</th>
              <td colspan="5">
                <label><input type="checkbox" /> 카드결제</label>
                <label><input type="checkbox" /> 포인트결제</label>
                <label><input type="checkbox" /> 카카오페이</label>
                <label><input type="checkbox" /> 휴대폰결제</label>
              </td>
            </tr>
            <tr>
              <th>받는분 이름</th>
              <td><input type="text" placeholder="받는분 이름" /></td>
              <th>받는분 휴대폰</th>
              <td><input type="text" placeholder="휴대폰번호" /></td>
              <th>받는분 주소</th>
              <td><input type="text" placeholder="주소" /></td>
            </tr>
            <tr>
              <th>사용자 이름</th>
              <td><input type="text" placeholder="사용자 이름" /></td>
              <th>사용자 휴대폰</th>
              <td><input type="text" placeholder="휴대폰번호" /></td>
              <th>사용자 이메일</th>
              <td><input type="text" placeholder="이메일" /></td>
            </tr>
          </tbody>
        </table>

        <!-- 하단 버튼 -->
        <div class="bottom-buttons">
          <button class="search-btn">검색</button>
        </div>
      </div>
    </transition>

    <!-- 컨트롤 영역 -->
    <div class="rounded-control">
      <!-- 왼쪽: 버튼 그룹 -->
      <div class="left-buttons">
        <button>전체선택</button>
        <button>선택해제</button>
        <button>선택 주문취소</button>
        <button>선택엑셀다운</button>
        <button>검색엑셀다운</button>
      </div>

      <!-- 오른쪽: select 박스 그룹 -->
      <div class="right-selects">
        <select>
          <option>주문일</option>
        </select>
        <select>
          <option>10개씩</option>
          <option>20개씩</option>
          <option>50개씩</option>
          <option>100개씩</option>
        </select>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="rounded-table-wrapper">
      <table class="rounded-order-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="allSelected" @change="toggleAll" /></th>
            <th>No</th>
            <th>주문번호/주문자</th>
            <th>상품</th>
            <th>결제정보</th>
            <th>주문일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody >
          
          <tr v-for="(order, i) in orders" :key="order.order_id">
            <td><input type="checkbox" :value="order.order_id" v-model="selectedOrders" /></td>
            <td>{{ orders.length - i }}</td>
            <td>
              <div class="order-num">{{ order.order_id }}</div>
              <div class="order-user">{{ order.user_name }}({{ order.user_id }})</div>
            </td>
            <td>
              <div class="product" v-for="(p, idx) in order.orderItems" :key="idx">
                <img :src="p.image_url" />
                <div>
                  <div class="product-name">{{ p.name }}</div>
                  <div class="product-device">PC</div>
                </div>
              </div>
            </td>
            
            <td>
              <div class="status status-green">배송상품</div>
              <div class="status status-blue">결제완료</div>
              <div class="price">{{ order.total_price }}원</div>
            </td>
            <td>{{ order.order_date }}</td>
            <td class="action-buttons">
              <router-link :to="`/order/detail/?order_id=${order.order_id}`" class="action-button-link">상세보기</router-link>
              <button>주문취소</button>
              <button disabled>주문서</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <button class="btn-main" @click="prevPage" :disabled="currentPage === 1"><</button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="['btn-main', { active: currentPage === page }]"
          >
        {{ page }}
        </button>
        <button class="btn-main" @click="nextPage" :disabled="currentPage === totalPages">></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'

const currentPage = ref(1)
const totalPages = ref(5) // 원하는 만큼 숫자 넣기 (예: 5페이지)
const showDetail = ref(false)

// 선택 / 전체선택
const selectedOrders = ref([]) // 선택된 주문번호를 저장할 배열
const allSelected = ref(false) // 전체 선택 여부

const orders = ref([])

const searchCondition = reactive({
  order_id: '',
  user_id: '',
  order_date: '',
  order_status: '',
  total_price: '',
  user_name: '',
  orderItems: [{ 
    name: '',
    image_url: '', 
    quantity: '',
    },
  ]
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    searchOrders();
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    searchOrders();
  }
}

const goToPage = (page) => {
  currentPage.value = page
  searchOrders();
}

const toggleAll = () => {
  if (allSelected.value) {
    selectedOrders.value = orders.value.map(o => o.order_id)
  } else {
    selectedOrders.value = []
  }
}

watch(selectedOrders, (newVal) => {
  allSelected.value = newVal.length === orders.value.length
})

// 검색 실행
const searchOrders = async () => {
  try {
    const response = await axios.get('/api/order/', {
      params: {
        order_id: searchCondition.order_id,
        user_id: searchCondition.user_id,
        order_date: searchCondition.order_date,
        order_status: searchCondition.order_status,
        total_price: searchCondition.total_price,
        user_name: searchCondition.user_name,
        name: searchCondition.orderItems[0].name,
        image_url: searchCondition.orderItems[0].image_url, 
        quantity: searchCondition.orderItems[0].quantity,
       }
      })
    
    // orders.splice(0, orders.value.length, ...response.data)
    orders.value = response.data.list
    console.log('받은 데이터:', response.data)
    console.log('🔥 전체 orders 구조:', JSON.stringify(orders.value, null, 2))
  } catch (error) {
    console.error('검색 실패:', error)
    alert('검색 중 오류 발생')
  }
}

onMounted(() => {
  searchOrders()
})

</script>

<style scoped src="@/assets/order/order.css"></style>