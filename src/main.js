
// import './assets/main.css'
// import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-icons/font/bootstrap-icons.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@/assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')