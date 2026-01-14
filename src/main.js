import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueTheMask from "vue-the-mask"
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/custom-bootstrap.scss';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const auth = useAuthStore()
auth.init()

app.use(router)
app.use(VueTheMask)
app.mount('#app')