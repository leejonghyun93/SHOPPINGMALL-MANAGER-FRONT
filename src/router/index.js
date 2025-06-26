import { createRouter, createWebHistory } from 'vue-router'
import SellerMain from '../components/seller/SellerMain.vue'
import ProductList from '../components/seller/product/ProductList.vue'
import ProductRegister from '../components/seller/product/ProductRegister.vue'
import ProductDetail from '../components/seller/product/ProductDetail.vue'
import ProductReviewList from '../components/seller/product/ProductReviewList.vue'
import ProductInquiryList from '../components/seller/product/ProductInquiryList.vue'
import ProductInquiryDetail from '../components/seller/product/ProductInquiryDetail.vue'
import ProductReviewDetail from '../components/seller/product/ProductReviewDetail.vue'
import ProductDetailMain from '../components/seller/product/ProductDetailMain.vue'
import Orderlist from '../components/seller/order/Orderlist.vue'
import OrderDetail from '../components/seller/order/OrderDetail.vue'
import ProductEdit from '../components/seller/product/ProductEdit.vue'

import BroadCastTest from '../components/seller/broadCast/test.vue'
import BroadCastRegister from '../components/seller/broadCast/BroadCastRegister.vue'
import BroadCastStart from '../components/seller/broadCast/BroadCastStart.vue'

const Login = () => import('@/components/login/login.vue')
const Register = () => import('@/components/host/register.vue')
const FindId = () => import('@/components/login/FindId.vue')
const FindPassword = () => import('@/components/login/FindPasswordStep1.vue')
const ChangePassword = () => import('@/components/login/ChangePassword.vue')

const routes = [
  { path: '/', name: 'Dashboard', component: SellerMain, meta: { requiresAuth: true }},
  { path: '/product', name: 'ProductList', component: ProductList },
  { path: '/product/register', name: 'ProductRegister', component: ProductRegister },
  { path: '/product/:productId/edit', name: 'ProductEdit', component: ProductEdit, props: true },
  { path: '/product/:productId', component: ProductDetail, props: true, children: [
  { path: '', name: 'ProductDetail', component : ProductDetailMain, props: true },
  { path: 'reviews', name: 'ProductReviewList', component: ProductReviewList, props: true },
  { path: 'reviews/:reviewId', name: 'ProductReviewDetail', component: ProductReviewDetail, props: true },
  { path: 'inquiries', name: 'ProductInquiryList', component: ProductInquiryList, props: true },
  { path: 'inquiries/:id', name: 'ProductInquiryDetail', component: ProductInquiryDetail, props: true }
]},


  { path: '/login', name: 'Login', component: Login },
  { path: '/host/register', name: 'Register', component: Register },
  { path: '/login/findId', name: 'FindId', component: FindId },
  { path: '/login/findPassword', name: 'FindPassword', component: FindPassword },
  { path: '/login/changePassword', name: 'ChangePassword', component: ChangePassword },
  { path: '/order', name: 'OrderList', component: Orderlist, props: true},
  { path: '/order/detail', name: 'OrderDetail', component: OrderDetail, props: true},

  { path: '/broadcast/test', name: 'BroadCastTest', component: BroadCastTest, props: true},
  { path: '/broadcast/register', name: 'BroadCastRegister', component: BroadCastRegister, props: true},
  { path: '/broadcast/start', name: 'BroadCastStart', component: BroadCastStart, props: true},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

// ✅ Navigation Guard 설정
const publicPages = ['/login', '/login/findId', '/login/findPassword', '/login/changePassword', '/host/register']

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('jwt') || !!sessionStorage.getItem('jwt')
  const isPublicPage = publicPages.includes(to.path)

  if (!isPublicPage && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router