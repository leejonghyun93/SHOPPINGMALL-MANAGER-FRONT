<template>
  <div class="product-registration">
    <h2>상품 등록</h2>
    <form @submit.prevent="submitForm">
      <!-- 1. 기본 정보 -->
      <AccordionSection title="기본 정보" :open="openBasic" @toggle="openBasic = !openBasic">
        <div class="form-group category-row">
          <label class="category-label">카테고리 <span class="required">*</span></label>
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
          <label>상품명 <span class="required">*</span></label>
          <input type="text" v-model="form.name" placeholder="예: 얼큰순대국 밀키트" required maxlength="100" />
          <div class="form-hint">상품명을 정확하게 입력해 주세요. (최대 100자)</div>
        </div>
      </AccordionSection>

      <!-- 2. 판매 정보 -->
      <AccordionSection title="판매 정보" :open="openSale" @toggle="openSale = !openSale">
        <div class="form-group">
          <label>상품 가격 <span class="required">*</span></label>
          <input type="number" v-model.number="form.price" min="0" required placeholder="예: 12000" />
          <div class="form-hint">소비자에게 노출되는 기본 가격입니다.</div>
        </div>
        <div class="form-group">
          <label>상품 판매가 <span class="required">*</span></label>
          <input type="number" v-model.number="form.salePrice" min="0" required placeholder="예: 9900" />
          <div class="form-hint">할인 등 실제 판매가를 입력하세요.</div>
        </div>
        <div class="form-group">
          <label>상품 재고 <span class="required">*</span></label>
          <input type="number" v-model.number="form.stock" min="0" required placeholder="예: 50" />
          <div class="form-hint">전체 재고 수량을 입력하세요.</div>
        </div>
        <div class="form-group">
          <label>상품 상태 <span class="required">*</span></label>
          <select v-model="form.status" required>
            <option value="판매중">판매중</option>
            <option value="품절">품절</option>
            <option value="판매중지">판매중지</option>
          </select>
        </div>
      </AccordionSection>

      <!-- 3. 상품 옵션 -->
      <AccordionSection title="상품 옵션 (선택)" :open="openOption" @toggle="openOption = !openOption">
        <div class="form-hint option-hint">
          옵션은 등록하지 않아도 됩니다. 옵션이 있을 경우만 입력하세요.<br>
          옵션별 판매가는 <b>상품 판매가</b> 기준 "0" 또는 "+, - 금액"으로 입력하세요.<br>
          예) 상품 판매가 9900원, 옵션가 0 → 9900원<br>
          옵션가 +1000 → 10,900원, 옵션가 -500 → 9,400원
        </div>
        <div v-for="(option, idx) in form.options" :key="idx" class="option-row">
          <div class="form-group option-group">
            <label>옵션명 <span class="required">*</span></label>
            <input type="text" v-model="option.name" placeholder="예: 얼큰순대국" required maxlength="50" />
          </div>
          <div class="form-group option-group">
            <label>판매가 차액 <span class="required">*</span></label>
            <input type="number" v-model.number="option.salePriceDiff" required placeholder="예: 0, +1000, -500" />
          </div>
          <div class="form-group option-group">
            <label>재고 <span class="required">*</span></label>
            <input type="number" v-model.number="option.stock" min="0" required placeholder="예: 20" />
          </div>
          <div class="form-group option-group">
            <label>상태 <span class="required">*</span></label>
            <select v-model="option.status" required>
              <option value="판매중">판매중</option>
              <option value="품절">품절</option>
              <option value="판매중지">판매중지</option>
            </select>
          </div>
          <button type="button" class="btn-option-del" @click="removeOption(idx)" :disabled="isSubmitting">삭제</button>
        </div>
        <button type="button" class="btn-option-add" @click="addOption" :disabled="isSubmitting">+ 옵션 추가</button>
        <div v-if="form.options.length === 0" class="form-hint" style="color:#2563eb;">
          옵션을 등록하지 않아도 상품 등록이 가능합니다.
        </div>
      </AccordionSection>

      <!-- 4. 이미지 및 상세 설명 -->
      <AccordionSection title="이미지 및 상세 설명" :open="openImage" @toggle="openImage = !openImage">
        <div class="form-group">
          <label>대표 이미지 <span class="required">*</span></label>
          <input type="file" @change="onMainImageChange" accept="image/*" :disabled="isSubmitting" required />
          <div v-if="form.mainImageUrl" class="image-preview-wrapper">
            <img :src="form.mainImageUrl" alt="대표 이미지 미리보기" class="image-preview" />
            <button type="button" class="btn-image-remove" @click="removeMainImage">이미지 삭제</button>
          </div>
          <div class="form-hint">
            최대 5MB, jpg/png/gif만 등록 가능. (권장: 정사각형, 800x800px 이상)
          </div>
          <div class="form-warning" v-if="imageError">{{ imageError }}</div>
        </div>
        <div class="form-group">
          <label>상세 설명 <span class="required">*</span></label>
          <ToastEditor v-model="form.description" :disabled="isSubmitting" />
          <div class="form-hint">상품의 특징, 구성, 사용법 등을 상세히 입력해 주세요.</div>
        </div>
      </AccordionSection>

      <!-- 5. 배송 및 기타 정보 -->
      <AccordionSection title="배송 및 기타 정보" :open="openEtc" @toggle="openEtc = !openEtc">
        <div class="form-group">
          <label>배송 정보</label>
          <select v-model="form.shipping" :disabled="isSubmitting">
            <option value="">선택 안함</option>
            <option value="무료배송">무료배송</option>
            <option value="유료배송">유료배송</option>
            <option value="당일배송">당일배송</option>
            <option value="새벽배송">새벽배송</option>
          </select>
        </div>
        <div class="form-group">
          <label>원산지</label>
          <input type="text" v-model="form.origin" placeholder="예: 국내산, 미국산" :disabled="isSubmitting" />
        </div>
        <div class="form-group">
          <label>유통기한</label>
          <input type="text" v-model="form.expiration" placeholder="예: 제조일로부터 1년" :disabled="isSubmitting" />
        </div>
        <div class="form-group">
          <label>보관방법</label>
          <input type="text" v-model="form.storage" placeholder="예: 냉장보관, 실온보관" :disabled="isSubmitting" />
        </div>
      </AccordionSection>

      <div class="form-warning form-bottom-warning" v-if="formError">
        {{ formError }}
      </div>
      <div class="form-success" v-if="formSuccess">
        {{ formSuccess }}
      </div>
      <div class="spinner-wrapper" v-if="isSubmitting">
        <div class="spinner"></div>
      </div>
      <button type="submit" class="btn submit-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-btn"></span>
        등록하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import ToastEditor from '../../ToastEditor.vue'
import AccordionSection from '@/components/common/AccordionSection.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })  // 또는 'smooth'
})
const router = useRouter()
const openBasic = ref(false)
const openSale = ref(false)
const openOption = ref(false)
const openImage = ref(false)
const openEtc = ref(false)

const isSubmitting = ref(false)
const formError = ref('')
const formSuccess = ref('')
const imageError = ref('')

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const categoryData = {
  '가전/디지털': {
    '컴퓨터': ['노트북', '데스크탑'],
    '스마트폰': ['안드로이드', '아이폰']
  },
  '식품': {
    '과일': ['사과', '바나나'],
    '채소': ['상추', '시금치']
  }
}

const largeCategories = Object.keys(categoryData)
const mediumCategories = ref([])
const smallCategories = ref([])

const selectedLargeCategory = ref('')
const selectedMediumCategory = ref('')
const selectedSmallCategory = ref('')

watch(selectedLargeCategory, (newVal) => {
  if (newVal && categoryData[newVal]) {
    mediumCategories.value = Object.keys(categoryData[newVal])
    selectedMediumCategory.value = ''
    smallCategories.value = []
    selectedSmallCategory.value = ''
  } else {
    mediumCategories.value = []
    selectedMediumCategory.value = ''
    smallCategories.value = []
    selectedSmallCategory.value = ''
  }
})

watch(selectedMediumCategory, (newVal) => {
  if (newVal && selectedLargeCategory.value && categoryData[selectedLargeCategory.value][newVal]) {
    smallCategories.value = categoryData[selectedLargeCategory.value][newVal]
    selectedSmallCategory.value = ''
  } else {
    smallCategories.value = []
    selectedSmallCategory.value = ''
  }
})

const form = reactive({
  name: '',
  mainImageFile: null,
  mainImageUrl: '',
  price: 0,
  salePrice: 0,
  stock: 0,
  status: '판매중',
  shipping: '',
  description: '',
  origin: '',
  expiration: '',
  storage: '',
  options: []
})

function addOption() {
  form.options.push({ name: '', salePriceDiff: 0, stock: 0, status: '판매중' })
}
function removeOption(idx) {
  form.options.splice(idx, 1)
}

function onMainImageChange(event) {
  imageError.value = ''
  const file = event.target.files && event.target.files[0]
  if (file) {
    if (file.size > MAX_IMAGE_SIZE) {
      imageError.value = '이미지 용량은 5MB 이하만 등록 가능합니다.'
      form.mainImageFile = null
      form.mainImageUrl = ''
      return
    }
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      imageError.value = 'jpg, png, gif 파일만 등록 가능합니다.'
      form.mainImageFile = null
      form.mainImageUrl = ''
      return
    }
    form.mainImageFile = file
    form.mainImageUrl = URL.createObjectURL(file)
  }
}

function validateForm() {
  if (!selectedLargeCategory.value || !selectedMediumCategory.value || !selectedSmallCategory.value) {
    formError.value = '카테고리를 모두 선택해 주세요.'
    return false
  }
  if (!form.name.trim()) {
    formError.value = '상품명을 입력해 주세요.'
    return false
  }
  if (form.price === null || form.price < 0) {
    formError.value = '상품 가격은 0 이상으로 입력해 주세요.'
    return false
  }
  if (form.salePrice === null || form.salePrice < 0) {
    formError.value = '상품 판매가는 0 이상으로 입력해 주세요.'
    return false
  }
  if (form.stock === null || form.stock < 0) {
    formError.value = '상품 재고는 0 이상으로 입력해 주세요.'
    return false
  }
  if (!form.status) {
    formError.value = '상품 상태를 선택해 주세요.'
    return false
  }
  if (!form.mainImageFile) {
    formError.value = '대표 이미지를 등록해 주세요.'
    return false
  }
  if (!form.description || !form.description.trim()) {
    formError.value = '상세 설명을 입력해 주세요.'
    return false
  }
  for (const [i, opt] of form.options.entries()) {
    if (!opt.name.trim()) {
      formError.value = `옵션 ${i + 1}의 옵션명을 입력해 주세요.`
      return false
    }
    if (opt.salePriceDiff === null || isNaN(opt.salePriceDiff)) {
      formError.value = `옵션 ${i + 1}의 판매가 차액을 입력해 주세요.`
      return false
    }
    if (opt.stock === null || opt.stock < 0) {
      formError.value = `옵션 ${i + 1}의 재고는 0 이상으로 입력해 주세요.`
      return false
    }
    if (!opt.status) {
      formError.value = `옵션 ${i + 1}의 상태를 선택해 주세요.`
      return false
    }
  }
  formError.value = ''
  return true
}

function removeMainImage() {
  form.mainImageFile = null
  form.mainImageUrl = ''
  // 파일 input도 초기화(선택된 파일 삭제)
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

async function submitForm() {
  formError.value = ''
  formSuccess.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 1200)) // demo용

  isSubmitting.value = false
  formSuccess.value = '상품이 성공적으로 등록되었습니다!'
  setTimeout(() => {
    formSuccess.value = ''
    // 실제 라우터 경로에 맞게 수정
    if (router && router.push) router.push('/products')
  }, 1400)
}
</script>

<style>
.product-registration {
  width: 100%;
  height: 100%;
  max-width: none;
  min-height: 0;
  margin: 0;
  padding: 40px 48px 48px 48px; /* 위 40px, 좌우/아래 48px */
  background: #fff;
  border-radius: 10px;     /* 더 각지게, 완전 각지게 하려면 0 */
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
  letter-spacing: -1px;
  color: #2a3140;
}
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
label {
  font-weight: 600;
  margin-bottom: 4px;
  color: #222;
}
.required {
  color: #ff4d4f;
  margin-left: 2px;
  font-size: 1.1em;
}
input[type="text"],
input[type="number"],
select {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #d5dbe5;
  border-radius: 7px;
  background: #fafbfc;
  transition: border-color 0.2s;
}
input:focus, select:focus {
  border-color: #3e7eff;
  outline: none;
}
.form-hint {
  font-size: 0.93em;
  color: #7e8ba3;
  margin-top: 2px;
  margin-left: 2px;
}
.form-warning {
  font-size: 0.97em;
  color: #d33;
  margin: 10px 0 0 2px;
  background: #fff3f4;
  border-left: 3px solid #ffb1b1;
  padding: 7px 12px;
  border-radius: 6px;
}
.form-bottom-warning {
  margin-top: 28px;
}
.category-label {
  margin-right: 18px;
}
.category-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
}
.category-selects {
  display: flex;
  gap: 18px;
  flex: 1;
}
.category-selects select {
  min-width: 160px;
}
.image-preview-wrapper {
  position: relative;
  display: inline-block;
}
.btn-image-remove {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: #fff3f4;
  color: #d33;
  border: 1px solid #ffb1b1;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.98em;
  cursor: pointer;
  z-index: 2;
}
.btn-image-remove:hover {
  background: #ffd0d0;
}
.accordion {
  border: 1px solid #e4e8f1;
  border-radius: 10px;
  margin-bottom: 24px;
  background: #f9fafc;
  box-shadow: 0 1px 3px rgba(60,80,120,0.03);
}
.accordion-header {
  padding: 14px 18px;
  font-weight: 700;
  font-size: 1.09rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f5fa;
  border-radius: 10px 10px 0 0;
  user-select: none;
}
.accordion-body {
  padding: 20px 18px 14px 18px;
  border-top: 1px solid #e4e8f1;
}
.option-row {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  margin-bottom: 10px;
  background: #f6f7fb;
  padding: 10px 12px;
  border-radius: 7px;
}
.option-group {
  flex: 1 1 0;
}
.btn-option-add {
  margin-top: 8px;
  background: #e8f0ff;
  color: #2563eb;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.97em;
  transition: background 0.2s;
}
.btn-option-add:hover {
  background: #d0e2ff;
}
.btn-option-del {
  background: #ffeaea;
  color: #d33;
  border: none;
  border-radius: 6px;
  padding: 7px 13px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.97em;
  transition: background 0.2s;
}
.btn-option-del:hover {
  background: #ffd0d0;
}
.image-preview {
  margin-top: 12px;
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.btn.submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 14px 0;
  font-size: 1.13rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 700;
  margin-top: 32px;
  transition: background-color 0.2s;
  letter-spacing: 1px;
}
.btn.submit-btn:hover {
  background-color: #1746a2;
}
.btn.submit-btn {
  display: block;
  margin: 32px auto 0 auto;
  width: 240px;
  text-align: center;
  position: relative;
}
.spinner-btn {
  display: inline-block;
  width: 20px; height: 20px;
  border: 3px solid #fff;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
.spinner-wrapper {
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 48px; height: 48px;
  border: 6px solid #eee;
  border-top: 6px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.form-warning, .form-success {
  margin: 20px 0 0 0;
  font-size: 1.08em;
  text-align: center;
}
.form-warning { color: #d33; }
.form-success { color: #2563eb; }
input[type="text"], input[type="number"], select, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  font-size: 1.05rem;
}
@media (max-width: 900px) {
  .product-registration {
    padding: 12px 2vw;
  }
  .btn.submit-btn {
    width: 100%;
    min-width: 0;
  }
}
@media (max-width: 900px) {
  .product-registration {
    padding: 18px 2vw;
    max-width: 100vw;
    min-width: 0;
  }
  .form-row, .option-row {
    flex-direction: column;
    gap: 8px;
  }
  .accordion-body {
    padding: 12px 6px 10px 6px;
  }
}
</style>
