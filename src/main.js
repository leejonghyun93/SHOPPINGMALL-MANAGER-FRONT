// import './assets/main.css'
// import './assets/tailwind.css'
import '../init'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-icons/font/bootstrap-icons.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@/assets/main.css'

const app = createApp(App)
app.use(router)

// 라우터 준비 완료 후에 마운트
router.isReady().then(() => {
  app.mount('#app')
})