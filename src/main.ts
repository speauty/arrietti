import { createApp } from 'vue'
import '@/styles/style.scss'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import router from '@/routers/router'
import { 
  ConfigProvider, Button, 
  message
 } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).use(ConfigProvider).use(Button).mount('#app').$nextTick(() => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})

app.config.globalProperties.$message = message
