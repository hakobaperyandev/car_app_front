import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
// import RegisterView from '../views/RegisterView.vue'
import DasboardView from '../views/DasboardView.vue'
import AdminPanelView from '../views/AdminView.vue'
function isAdmin(){
  const isAdmin = localStorage.getItem('is_admin');
  return isAdmin === 'true';
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DasboardView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanelView,
      beforeEnter:(to, from, next) => {
        if (isAdmin()) {
          next();
        } else {
          next('/dashboard'); 
        }
      },
    },
  ]
})

export default router
