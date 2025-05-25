import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { Buffer } from 'buffer'

import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'

import EnLang from './locales/en.json'
import RuLang from './locales/ru.json'

import 'vue3-toastify/dist/index.css'

// Создание приложения
const app = createApp(App)

// Подключение Pinia
app.use(createPinia())

// Настройка i18n
const i18n = createI18n({
  legacy: true,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    en: EnLang,
    ru: RuLang
  },
})
app.use(i18n)

// Поддержка Buffer в браузере
if (!window.Buffer) {
  window.Buffer = Buffer
}

// Подключение роутера
app.use(router)

// Подключение уведомлений
app.use(Vue3Toastify, {
  autoClose: 5000,
  position: 'top-right',
  theme: 'dark',
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  closeOnClick: true,
  hideProgressBar: false,
  newestOnTop: true,
  transition: 'slide',
})

// Монтирование приложения
app.mount('#app')