<template>
  <div class="product-registration">
    <h2>상품 등록</h2>
    <form @submit.prevent="submitForm">
      <!-- 1. 카테고리 + 상품명 -->
      <div class="accordion">
        <div class="accordion-header" @click="open1 = !open1">
          <span>카테고리 및 상품명 입력</span>
          <span>{{ open1 ? '▲' : '▼' }}</span>
        </div>
        <div class="accordion-body" v-show="open1">
          <div class="form-group category-row">
            <label class="category-label">카테고리</label>
            <div class="category-selects">
              <select v-model="selectedLargeCategory" required>
                <option disabled value="">대분류 선택</option>
                <option v-for="cat in largeCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <select v-model="selectedMediumCategory" required v-if="mediumCategories.length">
                <option disabled value="">중분류 선택</option>
                <option v-for="cat in mediumCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <select v-model="selectedSmallCategory" required v-if="smallCategories.length">
                <option disabled value="">소분류 선택</option>
                <option v-for="cat in smallCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>상품명</label>
            <input type="text" v-model="form.name" placeholder="상품명을 입력하세요" required />
          </div>
        </div>
      </div>

      <!-- 2. 상품 가격/판매가/재고 -->
      <div class="accordion">
        <div class="accordion-header" @click="open2 = !open2">
          <span>상품 가격/판매가/재고</span>
          <span>{{ open2 ? '▲' : '▼' }}</span>
        </div>
        <div class="accordion-body" v-show="open2">
          <div class="form-group">
            <label>상품 가격</label>
            <input type="number" v-model.number="form.price" min="0" required />
          </div>
          <div class="form-group">
            <label>상품 판매가</label>
            <input type="number" v-model.number="form.salePrice" min="0" required />
          </div>
          <div class="form-group">
            <label>상품 재고</label>
            <input type="number" v-model.number="form.stock" min="0" required />
          </div>
        </div>
      </div>

      <!-- 3. 이미지 및 상세설명 -->
      <div class="accordion">
        <div class="accordion-header" @click="open3 = !open3">
          <span>이미지 및 상세 설명</span>
          <span>{{ open3 ? '▲' : '▼' }}</span>
        </div>
        <div class="accordion-body" v-show="open3">
          <div class="form-group">
            <label>대표 이미지</label>
            <input type="file" @change="onMainImageChange" accept="image/*" required />
            <div v-if="form.mainImageUrl">
              <img :src="form.mainImageUrl" alt="대표 이미지 미리보기" class="image-preview" />
            </div>
          </div>
          <div class="form-group">
            <label>추가 이미지</label>
            <input type="file" multiple @change="onAdditionalImagesChange" accept="image/*" />
            <div class="additional-images-preview">
              <img v-for="(img, index) in form.additionalImageUrls" :key="index" :src="img" alt="추가 이미지 미리보기" class="image-preview" />
            </div>
          </div>
          <!-- 기존 textarea 부분을 아래처럼 교체 -->
<div class="form-group">
  <label>상세 설명</label>
  <ToastEditor v-model="form.description" />
</div>
        </div>
      </div>

      <!-- 4. 상품 상태/옵션/배송정보 -->
      <div class="accordion">
        <div class="accordion-header" @click="open4 = !open4">
          <span>상품 상태/옵션/배송 정보</span>
          <span>{{ open4 ? '▲' : '▼' }}</span>
        </div>
        <div class="accordion-body" v-show="open4">
          <div class="form-group">
            <label>상품 상태</label>
            <select v-model="form.status" required>
              <option value="판매중">판매중</option>
              <option value="품절">품절</option>
              <option value="판매중지">판매중지</option>
            </select>
          </div>
          <div class="form-group">
            <label>옵션 (색상, 사이즈 등)</label>
            <multiselect
              v-model="form.options"
              :options="availableOptions"
              :multiple="true"
              :taggable="true"
              placeholder="옵션을 선택하거나 입력하세요"
              label="name"
              track-by="name"
            />
          </div>
          <div class="form-group">
            <label>배송 정보</label>
            <select v-model="form.shipping">
              <option value="">선택 안함</option>
              <option value="무료배송">무료배송</option>
              <option value="유료배송">유료배송</option>
              <option value="당일배송">당일배송</option>
              <option value="새벽배송">새벽배송</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 5. 기본 상품 정보 -->
      <div class="accordion">
        <div class="accordion-header" @click="open5 = !open5">
          <span>기본 상품 정보</span>
          <span>{{ open5 ? '▲' : '▼' }}</span>
        </div>
        <div class="accordion-body" v-show="open5">
          <div class="form-group">
            <label>원산지</label>
            <input type="text" v-model="form.origin" placeholder="원산지를 입력하세요" />
          </div>
          <div class="form-group">
            <label>유통기한</label>
            <input type="text" v-model="form.expiration" placeholder="유통기한을 입력하세요" />
          </div>
          <div class="form-group">
            <label>보관방법</label>
            <input type="text" v-model="form.storage" placeholder="보관방법을 입력하세요" />
          </div>
        </div>
      </div>

      <button type="submit" class="btn submit-btn">등록하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import ToastEditor from '../../ToastEditor.vue'

const open1 = ref(true)
const open2 = ref(true)
const open3 = ref(true)
const open4 = ref(true)
const open5 = ref(true)

// 카테고리 데이터
const categoryData = {
  '가전/디지털': {
    '컴퓨터': ['노트북', '데스크탑'],
    '스마트폰': ['안드로이드', '아이폰']
  },
  '식품': {
    '과일': ['사과', '바나나'],
    '채소': ['상추', '시금치']
  }
};

const largeCategories = Object.keys(categoryData);
const mediumCategories = ref([]);
const smallCategories = ref([]);

const selectedLargeCategory = ref('');
const selectedMediumCategory = ref('');
const selectedSmallCategory = ref('');

watch(selectedLargeCategory, (newVal) => {
  if (newVal && categoryData[newVal]) {
    mediumCategories.value = Object.keys(categoryData[newVal]);
    selectedMediumCategory.value = '';
    smallCategories.value = [];
    selectedSmallCategory.value = '';
  } else {
    mediumCategories.value = [];
    selectedMediumCategory.value = '';
    smallCategories.value = [];
    selectedSmallCategory.value = '';
  }
});

watch(selectedMediumCategory, (newVal) => {
  if (newVal && selectedLargeCategory.value && categoryData[selectedLargeCategory.value][newVal]) {
    smallCategories.value = categoryData[selectedLargeCategory.value][newVal];
    selectedSmallCategory.value = '';
  } else {
    smallCategories.value = [];
    selectedSmallCategory.value = '';
  }
});

const form = reactive({
  name: '',
  mainImageFile: null,
  mainImageUrl: '',
  additionalImageFiles: [],
  additionalImageUrls: [],
  price: 0,
  salePrice: 0,
  stock: 0,
  status: '판매중',
  options: [],
  shipping: '',
  description: '',
  origin: '',
  expiration: '',
  storage: ''
});

const availableOptions = [
  { name: '빨강' },
  { name: '파랑' },
  { name: '초록' },
  { name: '소' },
  { name: '중' },
  { name: '대' }
];

function onMainImageChange(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    form.mainImageFile = file;
    form.mainImageUrl = URL.createObjectURL(file);
  }
}

function onAdditionalImagesChange(event) {
  const files = Array.from(event.target.files);
  form.additionalImageFiles = files;
  form.additionalImageUrls = files.map(file => URL.createObjectURL(file));
}

function submitForm() {
  alert('상품이 등록되었습니다!');
  console.log('등록 데이터:', {
    category: {
      large: selectedLargeCategory.value,
      medium: selectedMediumCategory.value,
      small: selectedSmallCategory.value
    },
    ...form
  });
}
</script>

<style scoped>
.product-registration {
  max-width: 1900px;
  margin: auto;
  padding: 32px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  width: calc(100% - 64px);
}
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 8px;
}
.category-label {
  margin-right: 18px;
}
input[type="text"],
input[type="number"],
select,
textarea {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.image-preview {
  margin-top: 12px;
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.additional-images-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.additional-images-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.btn.submit-btn {
  background-color: #3e7eff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn.submit-btn:hover {
  background-color: #2a5dcc;
}
.category-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.category-selects {
  display: flex;
  gap: 28px;
  flex: 1;
}
.category-selects select {
  min-width: 350px;
}
.accordion { border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; }
.accordion-header { padding: 12px 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #f5f7fa; }
.accordion-body { padding: 16px; border-top: 1px solid #eee; }
</style>
