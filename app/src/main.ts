import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Buffer } from 'buffer';

import App from './App.vue'
import router from './router';

const app = createApp(App);

const pinia = createPinia();

if (!window.Buffer) {
  window.Buffer = Buffer;
}

app.use(router);
app.use(pinia);
app.mount('#app');
