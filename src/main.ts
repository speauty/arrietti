import { createApp } from 'vue'
import '@/styles/style.scss'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import router from '@/routers/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
