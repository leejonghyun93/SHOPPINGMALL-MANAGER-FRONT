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
                <label><input type="checkbox" /> 결제대기</label>
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
                <label><input type="checkbox" /> 무통장입금</label>
                <label><input type="checkbox" /> 카카오페이</label>
                <label><input type="checkbox" /> 페이팔</label>
              </td>
            </tr>
            <tr>
              <th>회원구분</th>
              <td colspan="2">
                <label><input type="radio" name="userType" checked /> 전체</label>
                <label><input type="radio" name="userType" /> 회원</label>
                <label><input type="radio" name="userType" /> 비회원</label>
              </td>
              <th>상품타입</th>
              <td colspan="2">
                <label><input type="radio" name="productType" checked /> 전체</label>
                <label><input type="radio" name="productType" /> 배송상품</label>
                <label><input type="radio" name="productType" /> 티켓상품</label>
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
          <option>20개씩</option>
        </select>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="rounded-table-wrapper">
      <table class="rounded-order-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>No</th>
            <th>주문번호/주문자</th>
            <th>상품</th>
            <th>결제정보</th>
            <th>주문일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, i) in orders" :key="order.orderNo">
            <td><input type="checkbox" /></td>
            <td>{{ orders.length - i }}</td>
            <td>
              <div class="order-num">{{ order.orderNo }}</div>
              <div class="order-user">{{ order.user }}</div>
            </td>
            <td>
              <div class="product" v-for="(p, idx) in order.products" :key="idx">
                <img :src="p.image" />
                <div>
                  <div class="product-name">{{ p.name }}</div>
                  <div class="product-device">PC</div>
                </div>
              </div>
            </td>
            <td>
              <div class="status status-green">배송상품</div>
              <div class="status status-blue">결제완료</div>
              <div class="price">0원</div>
            </td>
            <td>{{ order.date }}</td>
            <td class="action-buttons">
              <router-link :to="`/order/detail/?order_id=${orders.orderNo}`" class="action-button-link">상세보기</router-link>
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
import { ref } from 'vue'

const currentPage = ref(1)
const totalPages = ref(5) // 원하는 만큼 숫자 넣기 (예: 5페이지)
const showDetail = ref(false)

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}
const orders = [
  {
    orderNo: '16910-20314-69919',
    user: '관리자 (master)',
    date: '2025-06-18 (14:24:38)',
    products: [
      { name: '유기농 통밀빵', image: 'https://via.placeholder.com/50' },
      { name: '명장 초코 도넛', image: 'https://via.placeholder.com/50' }
    ]
  },
  {
    orderNo: '07613-10021-48450',
    user: '관리자 (master)',
    date: '2025-06-18 (14:22:39)',
    products: [
      { name: '오리지널 & 생크림 도넛', image: 'https://via.placeholder.com/50' }
    ]
  },
  {
    orderNo: '87825-20831-43991',
    user: '관리자 (master)',
    date: '2025-06-18 (14:21:56)',
    products: [
      { name: '오렌지 크림 도넛', image: 'https://via.placeholder.com/50' }
    ]
  }
]
</script>

<style scoped src="@/assets/order/order.css"></style>