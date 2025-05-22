import { createRouter, createWebHistory } from 'vue-router'

// Импорты компонентов
import Home from '@/views/Home/Home.vue'
import Place from '@/views/Place/Place.vue'
import Tasks from '@/views/Tasks/Tasks.vue'
import Friends from '@/views/Friends/Friends.vue'
import FriendsUpgrade from '@/views/Friends/Upgrade/Upgrade.vue'
import LevelUp from '@/views/LevelUp/LevelUp.vue'
import Onborad from '@/views/Onborad/Onborad.vue'
import Leaderboard from '@/views/Leaderboard/Leaderboard.vue'
import Wallet from '@/views/Wallet/Wallet.vue'
import ErrorPage from '@/views/Error/Error.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/places',
      name: 'place',
      component: Place
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends
    },
    {
      path: '/friends/upgrade/:user_id',
      name: 'friends-upgrade',
      component: FriendsUpgrade
    },
    {
      path: '/level-up',
      name: 'level-up',
      component: LevelUp
    },
    {
      path: '/onborad/:type?',
      name: 'onborad',
      component: Onborad
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage
    }
  ]
})

export default router