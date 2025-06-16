<template>
  <aside class="seller-sidebar">
    <div class="sidebar-logo">
      <!-- 로고 클릭 시 메인으로 이동 -->
      <router-link to="/" class="logo-link" style="text-decoration: none; color: inherit;">
        <span style="font-size:1.2rem;font-weight:bold;">LOGO</span>
      </router-link>
    </div>
    <nav>
      <ul class="sidebar-menu">
        <li>
  <router-link to="/product" style="">
    상품 관리
  </router-link>
  
</li>
        <li>
          <a href="#">주문 관리</a>
        </li>
        <li>
          <a href="#">배송 관리</a>
        </li>
        <li>
          <a href="#">매출 현황</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// 추후 드롭다운 토글, 라우터 연동 등 필요하면 추가
</script>

<style>
.seller-sidebar {
  width: 400px;
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
  margin-bottom: 1rem;
}
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu li {
  margin-bottom: 0.5rem;
}
.sidebar-menu a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
  border-radius: 4px;
  transition: background 0.2s;
}
.sidebar-menu a:hover {
  background: #3a3f51;
}
</style>
