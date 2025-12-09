import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import RegistrationList from '../views/RegistrationList.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Registration List',
    component: RegistrationList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;