<template>
  <div class="product-list-page">
    <!-- 상단 상태 탭 -->
    <div class="status-tabs">
      <div
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['status-tab', { active: statusTab === tab.value }]"
        @click="setStatusTab(tab.value)"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tab.count }}</span>
      </div>
    </div>

    <!-- 필터/검색/정렬 영역 -->
    <div class="toolbar-spacer"></div>
    <div class="product-toolbar-row">
      <select v-model="selectedCategory" @change="filterProducts" class="category-select select-lg">
        <option value="">전체 카테고리</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <div class="toolbar-center">
        <div class="search-bar">
          <input
            v-model="searchKeyword"
            @keyup.enter="searchProducts"
            type="text"
            placeholder="상품명, 상품코드 검색"
          />
          <button @click="searchProducts" class="btn-main">검색</button>
        </div>
      </div>
      <select v-model="sortKey" @change="sortProducts" class="sort-select select-lg">
        <option value="registerDate">등록일순</option>
        <option value="modifyDate">수정일순</option>
        <option value="price">가격순</option>
        <option value="sales">판매량순</option>
        <option value="reviewCount">리뷰수순</option>
      </select>
    </div>

    <div class="table-zone">
      <div class="product-table-wrap">
        <table class="product-table">
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
              <th>썸네일</th>
              <th>상품코드</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>판매가</th>
              <th>재고수량</th>
              <th>상품상태</th>
              <th>노출</th>
              <th>판매량</th>
              <th>리뷰수</th>
              <th>등록일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in pagedProducts" :key="product.productCode">
              <td>
                <input type="checkbox" v-model="selectedProducts" :value="product.productCode" />
              </td>
              <td class="td-thumb">
                <img :src="product.thumbnailUrl" alt="썸네일" class="thumb-lg" />
              </td>
              <td>{{ product.productCode }}</td>
              <td>
                <router-link :to="`/product/${product.productCode}`" class="product-link">
                  {{ product.productName }}
                </router-link>
              </td>
              <td>{{ product.category }}</td>
              <td>{{ currency(product.price) }}</td>
              <td>{{ currency(product.salePrice) }}</td>
              <td>{{ product.stockQuantity }}</td>
              <td>{{ product.status }}</td>
              <td>
                <label class="switch">
                  <input type="checkbox" :checked="product.visible" @change="toggleVisible(product)" />
                  <span class="slider"></span>
                </label>
              </td>
              <td>{{ product.sales }}</td>
              <td>{{ product.reviewCount }}</td>
              <td>{{ product.registerDate }}</td>
              <td>{{ product.modifyDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 테이블 아래 별도 줄: 페이징 + 버튼 -->
      <div class="table-bottom-bar">
        <div class="pagination-wrapper">
          <div class="pagination">
            <button class="btn-main" @click="prevPage" :disabled="currentPage === 1">이전</button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="['btn-main', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
            <button class="btn-main" @click="nextPage" :disabled="currentPage === totalPages">다음</button>
          </div>
        </div>
        <div class="bottom-btns">
          <button class="btn-main" @click="registerProduct">상품 등록</button>
          <button class="btn-main" @click="toggleVisibleSelected">노출상태 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([
  {
    productCode: 'P001',
    productName: '상품1',
    category: '의류',
    price: 30000,
    salePrice: 25000,
    stockQuantity: 100,
    status: '판매중',
    visible: true,
    sales: 150,
    reviewCount: 20,
    registerDate: '2025-06-01',
    modifyDate: '2025-06-10',
    thumbnailUrl: 'https://via.placeholder.com/88x88?text=1'
  },
  {
    productCode: 'P002',
    productName: '상품2',
    category: '전자제품',
    price: 50000,
    salePrice: 45000,
    stockQuantity: 50,
    status: '판매중지',
    visible: false,
    sales: 80,
    reviewCount: 10,
    registerDate: '2025-05-15',
    modifyDate: '2025-06-05',
    thumbnailUrl: 'https://via.placeholder.com/88x88?text=2'
  },
  {
    productCode: 'P003',
    productName: '상품3',
    category: '가전',
    price: 150000,
    salePrice: 140000,
    stockQuantity: 30,
    status: '품절',
    visible: true,
    sales: 200,
    reviewCount: 50,
    registerDate: '2025-04-20',
    modifyDate: '2025-05-30',
    thumbnailUrl: 'https://via.placeholder.com/88x88?text=3'
  }
])

const categories = ['의류', '전자제품', '가전']

const statusTab = ref('')
const selectedCategory = ref('')
const searchKeyword = ref('')
const sortKey = ref('registerDate')
const selectedProducts = ref([])
const currentPage = ref(1)
const pageSize = 10

const statusTabs = computed(() => [
  { label: '전체', value: '', count: products.value.length },
  { label: '판매중', value: '판매중', count: products.value.filter(p => p.status === '판매중').length },
  { label: '판매중지', value: '판매중지', count: products.value.filter(p => p.status === '판매중지').length },
  { label: '품절', value: '품절', count: products.value.filter(p => p.status === '품절').length }
])

const filteredProducts = computed(() => {
  let filtered = products.value
  if (statusTab.value) filtered = filtered.filter(p => p.status === statusTab.value)
  if (selectedCategory.value) filtered = filtered.filter(p => p.category === selectedCategory.value)
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.productName.toLowerCase().includes(keyword) ||
      p.productCode.toLowerCase().includes(keyword)
    )
  }
  return filtered
})

const sortedProducts = computed(() => {
  return [...filteredProducts.value].sort((a, b) => {
    if (sortKey.value === 'registerDate') return new Date(b.registerDate) - new Date(a.registerDate)
    if (sortKey.value === 'modifyDate') return new Date(b.modifyDate) - new Date(a.modifyDate)
    if (sortKey.value === 'price') return b.price - a.price
    if (sortKey.value === 'sales') return b.sales - a.sales
    if (sortKey.value === 'reviewCount') return b.reviewCount - a.reviewCount
    return 0
  })
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / pageSize))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedProducts.value.slice(start, start + pageSize)
})

function setStatusTab(tab) {
  statusTab.value = tab
  currentPage.value = 1
}
function toggleAll(event) {
  selectedProducts.value = event.target.checked
    ? pagedProducts.value.map(p => p.productCode)
    : []
}
function searchProducts() { currentPage.value = 1 }
function filterProducts() { currentPage.value = 1 }
function sortProducts() { currentPage.value = 1 }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function goToPage(page) { currentPage.value = page }
function currency(value) { return '₩' + value.toLocaleString() }
const allSelected = computed(() =>
  pagedProducts.value.length > 0 &&
  pagedProducts.value.every(p => selectedProducts.value.includes(p.productCode))
)
function registerProduct() { router.push('/product/register') }
function toggleVisible(product) { product.visible = !product.visible }
function toggleVisibleSelected() {
  if (selectedProducts.value.length === 0) {
    alert('노출상태를 변경할 상품을 선택하세요.');
    return;
  }
  if (window.confirm('선택하신 상품의 노출 상태를 변경하시겠습니까?')) {
    products.value.forEach(product => {
      if (selectedProducts.value.includes(product.productCode)) {
        product.visible = !product.visible
      }
    })
    selectedProducts.value = []
    alert('선택된 상품의 노출상태가 변경되었습니다.')
  }
}
</script>

<style scoped>
.product-list-page {
  width: 100%;
  min-height: 100vh;
  padding: 32px 0 0 0;
  box-sizing: border-box;
}
.table-zone {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}
.product-table-wrap {
  width: 100%;
  overflow-x: auto;
  background: none;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(60,80,120,0.03);
}
.product-table th, .product-table td {
  text-align: center;
  padding: 1.05rem 0.5rem;
  border: 1px solid #e0e0e0;
  font-size: 1.05rem;
}
.product-table th {
  background-color: #f0f0f0;
  font-weight: 700;
}
.product-table tbody tr:hover {
  background-color: #f9f9f9;
}
.table-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 36px 0 0 0;
  gap: 0;
}
.pagination-wrapper {
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  width: 100%;
}
.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  scrollbar-width: thin;
}
.bottom-btns {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
.btn-main {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.13rem;
  font-weight: 700;
  padding: 0.54rem 1.6rem;
  cursor: pointer;
  transition: background 0.2s;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
}
.btn-main.active,
.pagination .btn-main.active {
  background: #1746a2;
  color: #fff;
}
.btn-main:disabled {
  background: #e5e7eb;
  color: #b3b9c9;
  cursor: not-allowed;
}
.btn-main:hover {
  background: #1746a2;
}
.select-lg {
  width: 210px !important;
  min-width: 210px !important;
  max-width: 210px !important;
  height: 48px !important;
  font-size: 1.08rem;
  padding: 0 16px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 48px;
}
.td-thumb {
  width: 100px;
  text-align: center;
  padding: 0.6rem 0.2rem !important;
}
.thumb-lg {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #f8f8f8;
  display: block;
  margin: 0 auto;
}
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  vertical-align: middle;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 20px;
  transition: .3s;
}
.switch input:checked + .slider {
  background-color: #2563eb;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .3s;
}
.switch input:checked + .slider:before {
  transform: translateX(16px);
}
.status-tabs { display: flex; gap: 36px; padding: 0 0 0 18px; background: none; height: 56px; align-items: flex-end; margin-bottom: 12px; }
.status-tab { font-size: 1.13rem; font-weight: 700; color: #8b95a1; cursor: pointer; padding: 0 0 12px 0; transition: color 0.18s, border-bottom 0.18s; border-bottom: 3px solid transparent; display: flex; align-items: flex-end; background: none; letter-spacing: -0.5px; }
.status-tab.active { color: #2563eb; border-bottom: 3px solid #2563eb; background: none; }
.tab-count { font-size: 1.02em; margin-left: 7px; color: #b3b9c9; font-weight: 600; }
.toolbar-spacer { height: 48px; }
.product-toolbar-row { display: flex; align-items: flex-start; justify-content: space-between; width: 100%; margin-bottom: 1.2rem; gap: 0; background: none; padding: 0 0 18px 0; box-sizing: border-box; }
.category-select, .sort-select { height: 48px; }
.category-select { min-width: 140px; max-width: 180px; font-size: 1rem; padding: 0.38rem 0.6rem; background: #f7f9fd; border: 1px solid #e2e7f3; border-radius: 6px; align-self: flex-start; }
.sort-select { min-width: 140px; max-width: 180px; font-size: 1rem; padding: 0.38rem 0.6rem; background: #f7f9fd; border: 1px solid #e2e7f3; border-radius: 6px; align-self: flex-start; }
.toolbar-center { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.search-bar { width: 100%; max-width: 700px; display: flex; align-items: center; gap: 0.7rem; margin: 0 auto; }
.search-bar input[type="text"] { flex: 1 1 0; padding: 0.54rem 1rem; font-size: 1.14rem; border-radius: 7px; border: 1px solid #d7d7e3; background: #fafbfc; height: 48px; max-width: 700px; }
@media (max-width: 1300px) {
  .table-zone, .table-bottom-bar { max-width: 100vw; }
}
@media (max-width: 900px) {
  .table-bottom-bar { flex-direction: column; gap: 18px; align-items: stretch; }
  .bottom-btns { justify-content: stretch; }
  .pagination-wrapper { width: 100%; justify-content: center; margin-bottom: 12px; }
}
</style>
