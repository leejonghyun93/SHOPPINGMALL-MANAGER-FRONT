<template>
  <div class="product-registration">
    <h2>상품 등록</h2>
    <form @submit.prevent="submitForm">
      <!-- 기본 정보 -->
      <AccordionSection title="기본 정보" :open="openBasic" @toggle="openBasic = !openBasic">
        <div class="category-selects">
          <select v-model="selectedLargeCategoryId">
            <option disabled value="">대분류 선택</option>
            <option v-for="cat in largeCategories" :key="cat.categoryId" :value="cat.categoryId">{{ cat.categoryName }}</option>
          </select>
          <select v-model="selectedMediumCategoryId" required v-if="mediumCategories.length">
            <option disabled value="">중분류 선택</option>
            <option v-for="cat in mediumCategories" :key="cat.categoryId" :value="cat.categoryId">{{ cat.categoryName }}</option>
          </select>
          <select v-model="selectedSmallCategoryId" v-if="smallCategories.length">
          <option disabled value="">소분류 선택</option>
          <option v-for="cat in smallCategories" :key="cat.categoryId" :value="cat.categoryId">{{ cat.categoryName }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>상품명 <span class="required">*</span></label>
          <input type="text" v-model="form.name" placeholder="예: 얼큰순대국 밀키트" required maxlength="100" />
          <div class="form-hint">상품명을 정확하게 입력해 주세요. (최대 100자)</div>
        </div>
      </AccordionSection>

      <!-- 판매 정보 -->
      <AccordionSection title="판매 정보" :open="openSale" @toggle="openSale = !openSale">
        <div class="form-group">
  <label>상품 가격 <span class="required">*</span></label>
  <input type="number" v-model.number="form.price" min="0" required />
  <div class="form-hint">소비자에게 노출되는 기본 가격입니다.</div>
</div>
<div class="form-group">
  <label>상품 판매가 <span class="required">*</span></label>
  <input type="number" v-model.number="form.salePrice" min="0" required />
  <div class="form-hint">할인 등 실제 판매가를 입력하세요.</div>
</div>
<div class="form-group">
  <label>상품 재고 <span class="required">*</span></label>
  <input type="number" v-model.number="form.stock" min="0" required />
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

      <!-- 상품 옵션 -->
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
            <input type="text" v-model="option.name" required maxlength="50" />
          </div>
          <div class="form-group option-group">
            <label>판매가 차액 <span class="required">*</span></label>
            <input type="number" v-model.number="option.salePriceDiff" required />
          </div>
          <div class="form-group option-group">
            <label>재고 <span class="required">*</span></label>
            <input type="number" v-model.number="option.stock" min="0" required />
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
          옵션을 등록하지 않아도 상품 수정이 가능합니다.
        </div>
      </AccordionSection>

      <!-- 이미지 및 상세 설명 -->
      <AccordionSection title="이미지 및 상세 설명" :open="openImage" @toggle="openImage = !openImage">
         <div class="form-group">
          <label>대표 이미지 <span class="required">*</span></label>
          <input type="file" @change="onMainImageChange" accept="image/*" :disabled="isSubmitting" />
          <div v-if="form.mainImageUrl || form.mainImage" class="image-preview-wrapper">
            <img :src="form.mainImageUrl || getImageUrl(form.mainImage)" alt="대표 이미지 미리보기" class="image-preview" />
            <button type="button" class="btn-image-remove" @click="removeMainImage">이미지 삭제</button>
          </div>
          <div class="form-hint">
            최대 5MB, jpg/png/gif만 등록 가능. (권장: 정사각형, 800x800px 이상)
          </div>
          <div class="form-warning" v-if="imageError">{{ imageError }}</div>
        </div>
        <div class="form-group">
          <label>상세 설명 <span class="required">*</span></label>
          <ToastEditor ref="toastEditorRef" v-model="form.description" :disabled="isSubmitting" />
          <div class="form-hint">상품의 특징, 구성, 사용법 등을 상세히 입력해 주세요.</div>
        </div>
        <div class="form-group">
          <label>간단 설명 <span class="required">*</span></label>
          <input type="text" v-model="form.shortDescription" required maxlength="200" />
          <div class="form-hint">상품의 주요 특징을 한 줄로 요약해 주세요. (최대 200자)</div>
        </div>
        <div class="form-warning" style="margin-top:14px;">
          ※ 상품 필수정보(원산지, 유통기한, 보관방법 등)는 상세설명에 반드시 기재해야 합니다.
        </div>
      </AccordionSection>

      <div v-if="formError" class="form-warning">{{ formError }}</div>
      <div v-if="formSuccess" class="form-success">{{ formSuccess }}</div>
      <div v-if="isSubmitting" class="spinner-wrapper"><div class="spinner"/></div>

      <button type="submit" class="btn submit-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-btn"></span>
        등록하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AccordionSection from '@/components/common/AccordionSection.vue'
import ToastEditor from '../../ToastEditor.vue'

const router = useRouter()
const isSubmitting = ref(false)
const formError = ref('')
const formSuccess = ref('')
const imageError = ref('')
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const categories = ref([])
const selectedLargeCategoryId = ref('')
const selectedMediumCategoryId = ref('')
const selectedSmallCategoryId = ref('')

const openBasic = ref(false)
const openSale = ref(false)
const openOption = ref(false)
const openImage = ref(false)

const form = reactive({
  name: '',
  shortDescription: '',
  mainImageFile: null,
  mainImageUrl: '',
  price: 0,
  salePrice: 0,
  stock: 0,
  status: '판매중',
  description: '',
  options: []
})

const toastEditorRef = ref(null)

const largeCategories = computed(() => categories.value)
const mediumCategories = computed(() =>
  categories.value.find(c => c.categoryId === selectedLargeCategoryId.value)?.children || []
)
const smallCategories = computed(() =>
  mediumCategories.value.find(c => c.categoryId === selectedMediumCategoryId.value)?.children || []
)

onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    categories.value = (await axios.get('/api/categories/tree')).data
  } catch {
    formError.value = '카테고리 정보를 불러오지 못했습니다.'
  }
})

function addOption() {
  form.options.push({ name: '', salePriceDiff: 0, stock: 0, status: '판매중' })
}
function removeOption(idx) {
  form.options.splice(idx, 1)
}
function removeMainImage() {
  form.mainImageFile = null
  form.mainImageUrl = ''
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

function onMainImageChange(e) {
  imageError.value = ''
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > MAX_IMAGE_SIZE) {
    imageError.value = '이미지 용량은 5MB 이하만 등록 가능합니다.'
    return
  }
  if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
    imageError.value = 'jpg, png, gif 파일만 등록 가능합니다.'
    return
  }
  form.mainImageFile = file
  form.mainImageUrl = URL.createObjectURL(file)
}

function validateForm() {
  // 대분류, 중분류만 선택해도 등록 가능 (소분류는 선택 안 해도 됨)
  if (!selectedLargeCategoryId.value || !selectedMediumCategoryId.value) {
    formError.value = '카테고리를 모두 선택해 주세요. (대분류/중분류 필수)'
    return false
  }
  if (!form.name.trim()) {
    formError.value = '상품명을 입력해 주세요.'
    return false
  }
  if (form.price < 0 || form.salePrice < 0 || form.stock < 0) {
    formError.value = '가격 및 재고는 0 이상으로 입력해 주세요.'
    return false
  }
  if (!form.mainImageFile) {
    formError.value = '대표 이미지를 등록해 주세요.'
    return false
  }
  if (!form.description.replace(/<[^>]*>/g, '').trim()) {
    formError.value = '상세 설명을 입력해 주세요.'
    return false
  }
  if (!form.shortDescription.trim()) {
    formError.value = '간단 설명을 입력해 주세요.'
    return false
  }
  for (const [i, o] of form.options.entries()) {
    if (!o.name.trim() || o.salePriceDiff == null || isNaN(o.salePriceDiff) || o.stock < 0 || !o.status) {
      formError.value = `옵션 ${i + 1} 정보를 모두 입력해 주세요.`
      return false
    }
  }
  formError.value = ''
  return true
}

async function submitForm() {
  formError.value = formSuccess.value = ''
  if (!validateForm()) return
  isSubmitting.value = true

  try {
    const formData = new FormData()
    // 소분류가 선택되면 소분류, 아니면 중분류, 아니면 대분류
    const categoryId =
      selectedSmallCategoryId.value ||
      selectedMediumCategoryId.value ||
      selectedLargeCategoryId.value
    formData.append('categoryId', categoryId)
    formData.append('name', form.name)
    formData.append('price', form.price)
    formData.append('salePrice', form.salePrice)
    formData.append('stock', form.stock)
    formData.append('productStatus', form.status)
    formData.append('mainImage', form.mainImageFile)
    formData.append('productShortDescription', form.shortDescription)
    formData.append('productDescription', form.description)
    if (form.options.length)
      formData.append(
        'options',
        JSON.stringify(
          form.options.map(o => ({
            optionName: o.name,
            salePrice: Number(form.salePrice) + Number(o.salePriceDiff),
            stock: o.stock,
            status: o.status
          }))
        )
      )

    await axios.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('상품이 성공적으로 등록되었습니다.')
      router.push({ name: 'ProductList' })
  } catch (e) {
    formError.value = e.response?.data?.message || '상품 등록에 실패했습니다.'
  } finally {
    isSubmitting.value = false
  }
}

// 아래는 불필요한 코드 예시 (주석 처리)
// let isUnmounted = false
// onUnmounted(() => { isUnmounted = true })
// 기타 불필요한 ref, editorInstance, el.style 등도 없음
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
