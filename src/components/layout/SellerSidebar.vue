<template>
  <aside class="seller-sidebar">
    <div class="sidebar-logo">
      <router-link to="/" class="logo-link" style="text-decoration: none; color: inherit;">
        <span style="font-size:2.5rem;font-weight:bold;">LOGO</span>
      </router-link>
    </div>
    <nav>
      <ul class="sidebar-menu">
        <li>
          <button
            class="sidebar-link sidebar-link-btn"
            @click="toggleProductMenu"
            :aria-expanded="productMenuOpen"
          >
            <span class="menu-icon">
              <!-- 상품 관리: 박스 아이콘 -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#fff" stroke-width="2"/><path d="M3 7L12 13L21 7" stroke="#fff" stroke-width="2"/></svg>
            </span>
            상품 관리
            <span class="dropdown-arrow" :class="{ open: productMenuOpen }">▼</span>
          </button>
          <ul v-show="productMenuOpen" class="submenu">
              <li>
                <router-link to="/product" class="submenu-link">조회/수정</router-link>
              </li>
              <li>
                <router-link to="/product/register" class="submenu-link">상품 등록</router-link>
              </li>
            </ul>
          </li>
        
        <li>
          <a href="#" class="sidebar-link">
            <span class="menu-icon">
              <!-- 주문 관리: 체크리스트 아이콘 -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" stroke-width="2"/><path d="M8 9H16M8 13H12" stroke="#fff" stroke-width="2"/><circle cx="8" cy="17" r="1" fill="#fff"/></svg>
            </span>
            주문 관리
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-link">
            <span class="menu-icon">
              <!-- 배송 관리: 트럭 아이콘 -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="1" y="5" width="15" height="13" rx="2" stroke="#fff" stroke-width="2"/><path d="M16 8H20L23 12V18C23 19.1046 22.1046 20 21 20H20C18.8954 20 18 19.1046 18 18V17" stroke="#fff" stroke-width="2"/><circle cx="6.5" cy="18.5" r="1.5" fill="#fff"/><circle cx="18.5" cy="18.5" r="1.5" fill="#fff"/></svg>
            </span>
            배송 관리
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-link">
            <span class="menu-icon">
              <!-- 방송 관리: 방송(플레이) 아이콘 -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/><polygon points="10,8 16,12 10,16" fill="#fff"/></svg>
            </span>
            방송 관리
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-link">
            <span class="menu-icon">
              <!-- 매출 현황: 차트 아이콘 -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="3" height="8" fill="#fff"/><rect x="10.5" y="6" width="3" height="12" fill="#fff"/><rect x="17" y="13" width="3" height="5" fill="#fff"/></svg>
            </span>
            매출 현황
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
const productMenuOpen = ref(localStorage.getItem('productMenuOpen') === 'true')
watch(productMenuOpen, v => localStorage.setItem('productMenuOpen', v))
function toggleProductMenu() {
  productMenuOpen.value = !productMenuOpen.value
}
</script>

<style scoped>
.seller-sidebar {
  width: 350px;
  background-color: #2f3247;
  color: white;
  height: 100vh;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
}
.sidebar-logo {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 2.5rem;
}
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 24px;
}
.sidebar-menu li {
  margin-bottom: 1.5rem;
  position: relative;
}
.sidebar-link,
.sidebar-link-btn {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 600;
  padding: 0.5rem 0 0.5rem 2.2rem;
  border-radius: 4px;
  transition: background 0.2s;
  letter-spacing: -1px;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.sidebar-link:hover,
.sidebar-link-btn:hover {
  background: #3a3f51;
}
.menu-icon {
  display: flex;
  align-items: center;
  margin-right: 1.1rem;
  min-width: 36px;
}
.dropdown-arrow {
  margin-left: auto;
  font-size: 0.6em;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}
.dropdown-arrow.open {
  transform: rotate(180deg);
}
.submenu {
  border-radius: 0 0 8px 8px;
  margin-top: 0.1rem;
  margin-left: 3.2rem;
  padding: 0.5rem 0.5rem 0.5rem 1.6rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  position: relative;
  z-index: 2;
}
.submenu-link {
  color: #fff;
  font-size: 1.15rem;
  text-decoration: none;
  display: block;
  padding: 0.38rem 0;
  border-radius: 4px;
  transition: background 0.18s;
  margin-bottom: 0.2rem;
}
.submenu-link:hover {
  background: #3a3f51;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.18s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (max-width: 600px) {
  .seller-sidebar { width: 100vw; }
  .sidebar-link, .sidebar-link-btn { font-size: 1.2rem; padding-left: 1rem; }
  .menu-icon { min-width: 26px; margin-right: 0.7rem; }
  .submenu { margin-left: 2rem; }
}
</style>
