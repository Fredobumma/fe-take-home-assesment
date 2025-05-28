import { createRouter, createWebHistory } from 'vue-router';

import { env } from '@/config/env';
const router = createRouter({
  history: createWebHistory(env.APP_BASE_PATH),
  routes: [
    {
      path: '/',
      name: 'Fe Asignment App Dashboard',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/school/:id',
      name: 'school',
      component: () => import('@/views/Home.vue'),
      props: true
    },
  ]
});

export default router;
