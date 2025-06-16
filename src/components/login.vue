<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="avatar">
          <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path fill-rule="evenodd" d="M14 13s-1-1.5-6-1.5S2 13 2 13v1h12v-1z"/>
          </svg>
        </div>
        <h2>LOGIN</h2>
      </div>

      <form @submit.prevent="handleLogin">
        <input v-model="user_id" type="text" placeholder="아이디를 입력하세요" required />
        <input v-model="password" type="password" placeholder="비밀번호를 입력하세요" required />

        <div class="options">
          <label><input type="checkbox" v-model="rememberMe" /> 아이디 저장</label>
        </div>
        
        <div>
          <button type="submit">로그인</button>
        </div>

        <div class="option">
          <router-link to="/">아이디 찾기</router-link>
          <b> | </b>
          <router-link to="/">비밀번호 찾기</router-link>
        </div>

        <p class="footer-text">
          당신도 호스트가 되고 싶나요?
          <router-link to="/host/register">호스트 가입</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user_id = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/login', {
      user_id: user_id.value,
      password: password.value,
    })

    const token = response.data.token
    if (rememberMe.value) {
      localStorage.setItem('jwt', token)
    } else {
      sessionStorage.setItem('jwt', token)
    }

    router.push('/dashboard')
  } catch (error) {
    alert('아이디 또는 비밀번호가 틀립니다.')
    console.error(error)
  }
}
</script>
<!-- 안녕 -->
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f6f9;
}

.login-box {
  width: 450px;
  background: white;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.login-header .avatar {
  font-size: 48px;
  color: #3b5998;
  margin-bottom: 0.5rem;
}

.login-header .avatar-icon {
  width: 48px;
  height: 48px;
}

.login-header h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 500;
}

form input[type="text"],
form input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

form .options {
  display: flex;
  justify-content: space-between;
  /* justify-content: center; */
  align-items: center;
  font-size: 13px;
  margin-bottom: 1rem;
}

form .options b {
  justify-content: center;
  text-decoration: none;
  color: #3b5998;
}


form button {
  width: 100%;
  background-color: #3b5998;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 1rem; /* 또는 20px 등 */
}

form button:hover {
  background-color: #2d4373;
}

.footer-text {
  margin-top: 1rem;
  font-size: 13px;
}

.footer-text a {
  color: #3b5998;
  text-decoration: none;
  font-weight: 500;
}
</style>