import { createRouter, createWebHistory } from 'vue-router';

import { env } from '@/config/env';

const router = createRouter({
  history: createWebHistory(env.VITE_APP_BASE_PATH),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/school/:id',
      name: 'school',
      component: () => import('@/views/SchoolView.vue'),
      props: true
    }
  ]
});

export default router;
