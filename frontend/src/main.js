import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // <- Router importieren

createApp(App)
    .use(router)                  // <- Router an Vue anhängen
    .mount('#app')