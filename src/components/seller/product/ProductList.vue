<template>
  <div class="product-list">
    <ul class="tab_list">
      <li class="active"><a href="#">전체</a></li>
      <li><a href="#">판매중</a></li>
      <li><a href="#">판매중지</a></li>
      <li><a href="#">품절</a></li>
    </ul>
    <!-- 필터/검색/정렬 영역 -->
    <div class="filter-bar">
      <!-- 카테고리 필터 -->
      <select v-model="selectedCategory" @change="filterProducts">
        <option value="">전체 카테고리</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <!-- 검색창 -->
      <input
        v-model="searchKeyword"
        @keyup.enter="searchProducts"
        type="text"
        placeholder="상품명, 상품코드 검색"
      />
      <button @click="searchProducts">검색</button>

      <!-- 정렬 기준 선택 -->
      <select v-model="sortKey" @change="sortProducts" class="sort-select">
        <option value="registerDate">등록일순</option>
        <option value="modifyDate">수정일순</option>
        <option value="price">가격순</option>
        <option value="sales">판매량순</option>
        <option value="reviewCount">리뷰수순</option>
      </select>
    </div>

    <!-- 상품 목록 테이블 -->
    <table class="product-table">
      <thead>
        <tr>
          <th><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
          <th>상품코드</th>
          <th>상품명</th>
          <th>카테고리</th>
          <th>가격</th>
          <th>판매가</th>
          <th>재고수량</th>
          <th>상품상태</th>
          <th>판매량</th>
          <th>리뷰수</th>
          <th>등록일</th>
          <th>수정일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in pagedProducts" :key="product.productCode">
          <td><input type="checkbox" v-model="selectedProducts" :value="product.productCode" /></td>
          <td>{{ product.productCode }}</td>
          <td>
            <router-link 
              :to="`/product/${product.productCode}`" style="color: inherit; text-decoration: none;">
              {{ product.productName }}
            </router-link>
          </td>
          <td>{{ product.category }}</td>
          <td>{{ currency(product.price) }}</td>
          <td>{{ currency(product.salePrice) }}</td>
          <td>{{ product.stockQuantity }}</td>
          <td>{{ product.status }}</td>
          <td>{{ product.sales }}</td>
          <td>{{ product.reviewCount }}</td>
          <td>{{ product.registerDate }}</td>
          <td>{{ product.modifyDate }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 상품 등록/상태변경/페이징 영역 -->
    <div class="product-list-actions">
      <button class="register-btn" @click="registerProduct">상품 등록</button>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
      <button class="status-btn" @click="changeProductStatus">상품 상태 변경</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 더미 데이터 예시
const products = ref([
  { productCode: 'P001', productName: '상품1', category: '의류', price: 30000, salePrice: 25000, stockQuantity: 100, status: '판매중', sales: 150, reviewCount: 20, registerDate: '2025-06-01', modifyDate: '2025-06-10' },
  { productCode: 'P002', productName: '상품2', category: '전자제품', price: 50000, salePrice: 45000, stockQuantity: 50, status: '판매중지', sales: 80, reviewCount: 10, registerDate: '2025-05-15', modifyDate: '2025-06-05' },
  { productCode: 'P003', productName: '상품3', category: '가전', price: 150000, salePrice: 140000, stockQuantity: 30, status: '품절', sales: 200, reviewCount: 50, registerDate: '2025-04-20', modifyDate: '2025-05-30' },
  // ... 더미 데이터 추가 가능
])

const categories = ['의류', '전자제품', '가전']

const selectedCategory = ref('')
const searchKeyword = ref('')
const sortKey = ref('registerDate')
const selectedProducts = ref([])
const currentPage = ref(1)
const pageSize = 10

const filteredProducts = computed(() => {
  let filtered = products.value
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }
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
    if (sortKey.value === 'registerDate') {
      return new Date(b.registerDate) - new Date(a.registerDate)
    } else if (sortKey.value === 'modifyDate') {
      return new Date(b.modifyDate) - new Date(a.modifyDate)
    } else if (sortKey.value === 'price') {
      return b.price - a.price
    } else if (sortKey.value === 'sales') {
      return b.sales - a.sales
    } else if (sortKey.value === 'reviewCount') {
      return b.reviewCount - a.reviewCount
    }
    return 0
  })
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / pageSize))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedProducts.value.slice(start, start + pageSize)
})

function toggleAll(event) {
  if (event.target.checked) {
    selectedProducts.value = pagedProducts.value.map(p => p.productCode)
  } else {
    selectedProducts.value = []
  }
}

function searchProducts() {
  currentPage.value = 1
}

function filterProducts() {
  currentPage.value = 1
}

function sortProducts() {
  currentPage.value = 1
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(page) {
  currentPage.value = page
}

function currency(value) {
  return '₩' + value.toLocaleString()
}

const allSelected = computed(() =>
  pagedProducts.value.length > 0 &&
  pagedProducts.value.every(p => selectedProducts.value.includes(p.productCode))
)

function registerProduct() {
  router.push('/product/register')
}

function changeProductStatus() {
  if (selectedProducts.value.length === 0) {
    alert('상태를 변경할 상품을 선택하세요.');
    return;
  }
  alert('선택된 상품의 상태를 변경합니다. (구현 필요)');
}
</script>

<style scoped>
.clearfix:before, .clearfix:after {
    display: block;
    content: '';
    line-height: 0;
}

.clearfix:after {
    clear: both;
}
html{min-width:320px;}
body{margin:0;padding:0;font-family:'AppleSDGothicNeo', sans-serif;color:#242424}
html, h1, h2, h3, h4, h5, h6, form, fieldset, img {margin:0;padding:0;border:0}
h1, h2, h3, h4, h5, h6 {font-size:1em;font-family:'AppleSDGothicNeo', sans-serif}
article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display:block}
ul, ol, dl, dt, dd{margin:0;padding:0;list-style:none}
legend {position:absolute;margin:0;padding:0;font-size:0;line-height:0;text-indent:-9999em;overflow:hidden}
label, input, button, select, img {vertical-align:middle;font-size:1em}
input, button {margin:0;padding:0;font-family: 'AppleSDGothicNeo', sans-serif;font-size:1em;}
input, textarea, button {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
	color: #333;
}
input[type="submit"]{cursor:pointer}
button{cursor:pointer;background-color:transparent;border:0}
/* button:focus{outline:0} */
img{max-width:100%}
textarea, select{font-family:'AppleSDGothicNeo', sans-serif;font-size:1em}
select{margin:0}
table{border-collapse:collapse;width:100%;border-spacing:0}
table caption{display:inline-block !important;position:absolute;top:0;left:0;margin:0 !important;padding:0 !important;font-size:0 !important;line-height:0;border:0 !important;overflow:hidden !important}
table,td,th{border-spacing:0}
select::-ms-expand{display:none}
p {margin:0;padding:0;word-break:keep-all}
hr {display:none}
a {color:#242424;text-decoration:none;transition:.3s}
a:hover{text-decoration:none}
*, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.product-list {
  font-family: Arial, sans-serif;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-bar input[type="text"] {
  flex-grow: 1;
  padding: 0.3rem 0.5rem;
}
.filter-bar select,
.filter-bar button {
  padding: 0.3rem 0.5rem;
}
.sort-select {
  margin-left: auto;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th, .product-table td {
  text-align: center;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
}
.product-table th {
  background-color: #f0f0f0;
}
.product-table tbody tr:hover {
  background-color: #f9f9f9;
}

/* 상품 등록/상태변경/페이징 영역 스타일 */
.product-list-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.register-btn, .status-btn {
  padding: 0.4rem 1.2rem;
  border: none;
  background-color: #2f3247;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.register-btn:hover, .status-btn:hover {
  background-color: #3a3f51;
}
.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}
.pagination button {
  cursor: pointer;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}
.pagination button.active {
  background-color: #2f3247;
  color: white;
  border-color: #2f3247;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.tab_list{list-style: none; display: flex; gap:10px; padding: 0; margin:0 0 20px 0;}
.tab_list li.active{border-bottom: 1px solid blue; padding-bottom: 10px;}
.tab_list li.active a{color:blue;}
</style>
