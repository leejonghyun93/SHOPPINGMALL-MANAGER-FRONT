import { createRouter, createWebHistory } from 'vue-router'
import SellerMain from '../components/seller/SellerMain.vue'
import ProductList from '../components/seller/product/ProductList.vue'
import ProductRegister from '../components/seller/product/ProductRegister.vue'
import ProductDetail from '../components/seller/product/ProductDetail.vue'
import ProductReviewList from '../components/seller/product/ProductReviewList.vue'
import ProductInquiryList from '../components/seller/product/ProductInquiryList.vue'
import ProductInquiryDetail from '../components/seller/product/ProductInquiryDetail.vue'
import ProductReviewDetail from '../components/seller/product/ProductReviewDetail.vue'

// 아래 두 개는 코드 스플리팅을 위해 동적 import로 유지
const Login = () => import('@/components/login.vue')
const Register = () => import('@/components/host/register.vue')

const routes = [
  // ✅ 이름만 넣기
  { path: '/', name: 'Dashboard', component: SellerMain, meta: { layout: 'DefaultLayout' } },
  { path: '/product', name: 'ProductList', component: ProductList, meta: { layout: 'DefaultLayout' } },
  { path: '/product/register', name: 'ProductRegister', component: ProductRegister, meta: { layout: 'DefaultLayout' } },
  { path: '/product/:productCode', name: 'ProductDetail', component: ProductDetail, props: true, meta: { layout: 'DefaultLayout' } },
  { path: '/product/:productCode/reviews', name: 'ProductReviewList', component: ProductReviewList, props: true, meta: { layout: 'DefaultLayout' } },
  { path: '/product/:productCode/inquiries', name: 'ProductInquiryList', component: ProductInquiryList, props: true, meta: { layout: 'DefaultLayout' } },
  { path: '/porduct/inquiryDetail/:id', name: 'ProductInquiryDetail', component: ProductInquiryDetail, props: true, meta: { layout: 'DefaultLayout' } },
  { path: '/porduct/reviewDetail/:id', name: 'ProductReviewDetail', component: ProductReviewDetail, props: true, meta: { layout: 'DefaultLayout' } },

  // ✅ 로그인/회원가입은 EmptyLayout
  { path: '/login', name: 'Login', component: Login, meta: { layout: 'EmptyLayout' }},
  { path: '/host/register', name: 'Register', component: Register, meta: { layout: 'EmptyLayout' }},


  // 404 등 예외 처리 (선택)
  // { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 항상 페이지 최상단으로 이동
    return { left: 0, top: 0 }
  }
})

export default router

