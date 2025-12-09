import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueTheMask from "vue-the-mask"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/custom-bootstrap.scss';

createApp(App)
    .use(router)
    .use(VueTheMask)
    .mount('#app');
