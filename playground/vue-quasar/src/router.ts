import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/person',
  },
  {
    path: '/person',
    component: () => import('./pages/PersonList.vue'),
  },
  {
    path: '/person/add',
    component: () => import('./pages/PersonAdd.vue'),
  },
  {
    path: '/person/edit/:id',
    component: () => import('./pages/PersonEdit.vue'),
  },
  {
    path: '/person/view/:id',
    component: () => import('./pages/PersonView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
