<template>
  <div class="product-list-page">
    <!-- 상태 탭 -->
    <div class="status-tabs">
      <div
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['status-tab', { active: statusTab === tab.value }]"
        @click="setStatusTab(tab.value)"
      >
        {{ tab.label }}
        <span class="tab-count">{{ statusCounts[tab.value] || 0 }}</span>
      </div>
    </div>

    <!-- 툴바 -->
    <div class="product-toolbar-row">
      <div class="toolbar-left">
        <select v-if="categories && categories.length > 0" v-model="selectedCategory" @change="onCategoryChange" class="category-select">
          <option value="">전체 대분류</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>
      </div>
      <div class="toolbar-center">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="상품명, 상품번호 검색"
          @keyup.enter="searchProducts"
          class="search-input"
        />
        <button class="btn-main search-btn" @click="searchProducts">검색</button>
      </div>
      <div class="toolbar-right">
        <select v-model="sortKey" @change="sortProducts" class="sort-select">
          <option value="createdDate">최신순</option>
          <option value="productSalesCount">판매량순</option>
          <option value="productReviewCount">후기 많은순</option>
          <option value="stock">재고 적은순</option>
        </select>
      </div>
    </div>

    <!-- 상품 테이블 -->
    <div class="table-zone">
      <div class="product-table-wrap">
        <table class="product-table">
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
              <th>썸네일</th>
              <th>상품번호</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>정상가</th>
              <th>판매가</th>
              <th>재고</th>
              <th>상태</th>
              <th>진열여부</th>
              <th>판매수량</th>
              <th>후기</th>
              <th>등록일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="14">로딩중...</td>
            </tr>
            <tr v-else-if="error">
              <td colspan="14" style="color:red;">{{ error }}</td>
            </tr>
            <tr v-else-if="pagedProducts.length === 0">
              <td colspan="14">상품이 없습니다.</td>
            </tr>
            <tr
              v-for="product in pagedProducts"
              :key="product.productId"
              :class="{ 'row-inactive': product.displayYn === 'N' }"
            >
              <td>
                <input type="checkbox" v-model="selectedProducts" :value="product.productId" />
              </td>
              <td class="td-thumb">
                <img :src="product.mainImage" alt="썸네일" class="thumb-lg" />
              </td>
              <td>{{ product.productId }}</td>
              <td>
                <router-link :to="{ name: 'ProductDetail', params: { productCode: product.productId } }">
                  {{ product.name }}
                </router-link>
              </td>
              <td>
                {{ [product.mainCategoryName, product.midCategoryName, product.subCategoryName].filter(Boolean).join(' > ') }}
              </td>
              <td>{{ currency(product.price) }}</td>
              <td>{{ currency(product.salePrice) }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ statusMap[product.productStatus] || product.productStatus }}</td>
              <td>
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="product.displayYn"
                    true-value="Y"
                    false-value="N"
                    @change="toggleDisplayYn(product)"
                  />
                  <span class="slider"></span>
                </label>
              </td>
              <td>{{ product.productSalesCount }}</td>
              <td>{{ product.productReviewCount }}</td>
              <td>{{ formatDate(product.createdDate) }}</td>
              <td>{{ formatDate(product.updatedDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-bottom-bar">
        <div class="left-dummy"></div>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([])
const totalElements = ref(0)
const loading = ref(false)
const error = ref('')
const selectedProducts = ref([])
const currentPage = ref(1)
const pageSize = 10

const statusCounts = ref({
  ALL: 0,
  ACTIVE: 0,
  INACTIVE: 0,
  SOLD_OUT: 0
})

const statusTabs = [
  { label: '전체', value: 'ALL' },
  { label: '판매중', value: 'ACTIVE' },
  { label: '판매중지', value: 'INACTIVE' },
  { label: '품절', value: 'SOLD_OUT' }
]

const statusMap = {
  ACTIVE: '판매중',
  INACTIVE: '판매중지',
  SOLD_OUT: '품절'
}

const statusTab = ref('ALL')
const selectedCategory = ref('')
const searchKeyword = ref('')
const sortKey = ref('createdDate')
const categories = ref([])

async function fetchCategories() {
  try {
    const res = await axios.get('api/categories/main')
    if (Array.isArray(res.data)) {
      categories.value = res.data.filter(c => c !== null && c.categoryId)
    } else {
      categories.value = []
    }
  } catch (e) {
    categories.value = []
  }
}

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize,
      sort: sortKey.value === 'stock' ? 'stock,asc' : `${sortKey.value},desc`,
      status: statusTab.value === 'ALL' ? undefined : statusTab.value,
      categoryId: selectedCategory.value || undefined,
      keyword: searchKeyword.value
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) delete params[key]
    })

    const res = await axios.get('/api/products', { params })
    products.value = res.data.content
    totalElements.value = res.data.totalElements
    statusCounts.value = res.data.statusCounts || {
      ALL: 0, ACTIVE: 0, INACTIVE: 0, SOLD_OUT: 0
    }
  } catch (e) {
    error.value = '상품 목록을 불러오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const totalPages = computed(() => Math.ceil(totalElements.value / pageSize))
const pagedProducts = computed(() => products.value)

function setStatusTab(tabValue) {
  statusTab.value = tabValue
  currentPage.value = 1
  fetchProducts()
}
function onCategoryChange() {
  currentPage.value = 1
  fetchProducts()
}
function searchProducts() {
  currentPage.value = 1
  fetchProducts()
}
function sortProducts() {
  currentPage.value = 1
  fetchProducts()
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts()
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchProducts()
  }
}
function goToPage(page) {
  currentPage.value = page
  fetchProducts()
}

function currency(value) {
  if (value == null) return '-'
  return '₩' + value.toLocaleString()
}
function formatDate(date) {
  if (!date) return ''
  return date.toString().slice(0, 10)
}

const allSelected = computed(() =>
  pagedProducts.value.length > 0 &&
  pagedProducts.value.every(p => selectedProducts.value.includes(p.productId))
)
function toggleAll(event) {
  selectedProducts.value = event.target.checked
    ? pagedProducts.value.map(p => p.productId)
    : []
}
function registerProduct() {
  router.push('/product/register')
}

// 진열여부 토글 (Y/N) API 호출
async function toggleDisplayYn(product) {
  const prev = product.displayYn === 'Y' ? 'N' : 'Y'
  try {
    await axios.post('/api/products/display-yn', {
      productId: product.productId,
      displayYn: product.displayYn
    })
    // 성공시 별도 처리 필요 없음
  } catch (e) {
    // 실패 시 롤백
    product.displayYn = prev
    alert('진열여부 변경에 실패했습니다.')
  }
}

function toggleVisibleSelected() {
  if (selectedProducts.value.length === 0) {
    alert('노출상태를 변경할 상품을 선택하세요.')
    return
  }
  if (window.confirm('선택하신 상품의 노출 상태를 변경하시겠습니까?')) {
    products.value.forEach(product => {
      if (selectedProducts.value.includes(product.productId)) {
        product.displayYn = product.displayYn === 'Y' ? 'N' : 'Y'
        toggleDisplayYn(product)
      }
    })
    selectedProducts.value = []
    alert('선택된 상품의 노출상태가 변경되었습니다.')
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})
</script>


<style scoped>
/* 토글이 꺼진(미진열) 상품 행 흐리게 표시 */
.row-inactive {
  opacity: 0.5;
}
.product-table .switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.product-table .switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.product-table .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}
.product-table .switch input:checked + .slider {
  background-color: #2196F3;
}
.product-table .slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.product-table .switch input:checked + .slider:before {
  transform: translateX(16px);
}
.product-list-page {
  width: 100%;
  min-height: 100vh;
  padding: 32px 0 0 0;
  box-sizing: border-box;
}

.category-select,
.sort-select {
  height: 44px;
  min-width: 200px;
  
  font-size: 1rem;
  padding: 0.38rem 0.6rem;
  background: #f7f9fd;
  border: 1px solid #e2e7f3;
  border-radius: 6px;
}

.product-toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 1.4rem;
  padding: 0 0 18px 0;
  box-sizing: border-box;
  gap: 24px;
}

.toolbar-left,
.toolbar-right {
  flex-shrink: 0;
}

.toolbar-center {
  display: flex;
  align-items: center;
  justify-content: center; /* ← 중앙 정렬 핵심 */
  gap: 8px; /* 버튼과 입력창 간격 */
  flex: 1;
}

.search-input {
  width: 600px; /* ← 너가 원하는 값으로 조절 */
  height: 44px;
  padding: 0 14px;
  font-size: 1.08rem;
  border-radius: 7px;
  border: 1px solid #d7d7e3;
  background: #fafbfc;
  box-sizing: border-box;
  line-height: 44px;
}

.search-btn {
  flex-shrink: 0;
  height: 44px;
  padding: 0 24px;
  font-size: 1rem;
  border-radius: 7px;
  white-space: nowrap;
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
  margin-top: 36px;
  gap: 1.2rem;
}

.left-dummy {
  width: 200px; /* 버튼 영역과 균형 맞추기 위한 너비 */
}

.pagination-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}
.pagination::-webkit-scrollbar {
  display: none;
}

.bottom-btns {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  flex-shrink: 0;
  min-width: 200px; /* 왼쪽 dummy와 균형 맞춤 */
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

</style>
