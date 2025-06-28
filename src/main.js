import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

// Базовый URL для всех запросов
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Автоматическое добавление API ключа к запросам
axios.interceptors.request.use(config => {
  if (config.url.startsWith('/api/')) {
    config.params = {
      ...config.params,
      key: import.meta.env.VITE_API_KEY
    }
  }
  return config
})

// Инициализация Chart.js
Chart.register(...registerables)

const app = createApp(App)

// Глобальный обработчик ошибок
app.config.errorHandler = (err) => {
  console.error('Ошибка приложения:', err)
}

app.config.globalProperties.$http = axios
app.use(router)
app.mount('#app')
