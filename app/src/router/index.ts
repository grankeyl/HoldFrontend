import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue')
    },
    {
      path: '/places',
      name: 'place',
      component: () => import('@/views/Place/Place.vue')
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/Tasks/Tasks.vue')
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/Friends/Friends.vue')
    },
    {
      path: '/friends/upgrade/:id',
      name: 'friends-upgrade',
      component: () => import('@/views/Friends/Upgrade/Upgrade.vue')
    },
    {
      path: '/level-up',
      name: 'level-up',
      component: () => import('@/views/LevelUp/LevelUp.vue')
    },
    {
      path: '/onborad/:type',
      name: 'onborad',
      component: () => import('@/views/Onborad/Onborad.vue')
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('@/views/Leaderboard/Leaderboard.vue')
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('@/views/Wallet/Wallet.vue')
    }
  ]
})

export default router