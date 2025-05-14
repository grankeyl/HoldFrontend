import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Buffer } from 'buffer';

import App from './App.vue'
import router from './router';
import Vue3Toastify from 'vue3-toastify';

import 'vue3-toastify/dist/index.css';

const app = createApp(App);
const pinia = createPinia();

if (!window.Buffer) {
  window.Buffer = Buffer;
}

app.use(router);
app.use(pinia);
app.use(Vue3Toastify, {
  autoClose: 5000,
  position: 'top-right',
  theme: 'dark',
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  closeOnClick: true,
  hideProgressBar: false,
  newestOnTop: true,
  transition: 'slide'
});
app.mount('#app');
