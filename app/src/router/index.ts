import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home/Home.vue'
import Places from '@/views/Place/Place.vue'
import Tasks from '@/views/Tasks/Tasks.vue'
import Friends from '@/views/Friends/Friends.vue'
import FriendsUpgrade from '@/views/Friends/Upgrade/Upgrade.vue'
import Leaderboard from '@/views/Leaderboard/Leaderboard.vue'
import Wallet from '@/views/Wallet/Wallet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/places',
      name: 'place',
      component: Places,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends,
    },
    {
      path: '/friends/upgrade/:user_id',
      name: 'friends-upgrade',
      component: FriendsUpgrade,
    },
    {
      path: '/level-up',
      name: 'level-up',
      component: () => import('@/views/LevelUp/LevelUp.vue'),
    },
    {
      path: '/onborad/:type?',
      name: 'onborad',
      component: () => import('@/views/Onborad/Onborad.vue'),
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet,
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/Error/Error.vue'),
    }
  ]
})

export default router