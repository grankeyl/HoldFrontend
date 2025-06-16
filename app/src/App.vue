<template>
  <div class="content">
    <Load v-if="loadingPage || miniAppLoading" />

    <RouterView 
      v-if="(!miniAppLoading && !loadingPage)" 

      @loaded="onRouterViewLoaded"
      :success="pageSuccess"
    />

    <Menu v-if="(!miniAppLoading && !loadingPage) && initMenu()" />
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppCache } from './stores/pinia';
import { usePlaceStore } from './stores/place.storage';
import { getCurrentLanguage } from './utils/useApp';

import type { GameDataType } from './types/types';

import * as authApi from '@/api/services/auth.service'
import * as userApi from '@/api/services/user.service'
import * as placesApi from '@/api/services/places.service'
import * as tasksApi from '@/api/services/tasks.service'
import * as gamesApi from '@/api/services/games.service'

import Load from '@/components/Load/Load.vue'
import Menu from '@/components/Menu/Menu.vue'
import Toast from 'primevue/toast';
import TelegramModule from './hooks/useTelegram';


export default {
  components: {
    Load,
    Menu,
    Toast,
  },

  setup() {
    const isDev = import.meta.env.DEV;
    const initDataUnsafe = ref(TelegramModule.initData()) as any;
    const initDataRaw = ref(isDev
      ? import.meta.env.VITE_INIT_DATA
      : TelegramModule.initDataRaw()
    ) as any;

    const router = useRouter();
    const appCache = AppCache() as any;
    const storePlace = usePlaceStore() as any;

    const loadingPage = ref(true);
    const pageSuccess = ref(false);

    const miniAppLoading = ref(true);

    const authenticate = async () => {
      const login = await authApi.login({
        initData: initDataRaw.value
      });

      if (!login) { return; }

      return login;
    };

    const mountMiniApp = () => {
      TelegramModule.initMiniApp();
      TelegramModule.useHeavyHaptic();
    }

    const checkLevelUp = () => {
      if (appCache.UserData.place.updated) {
        router.push({ name: 'level-up' });
      }
    }

    const setNewPlaceStore = (status: string) => {
      if (status === 'registered') {
        storePlace.setCurrentPlace({
          placeId: 1,
          placeType: 'village'
        });
      } else if (status === 'slaved') {
        storePlace.setCurrentPlace({
          placeId: 0,
          placeType: ''
        });
      }
    }

    const onAppLoad = async () => {
      loadingPage.value = false;
      pageSuccess.value = true;
      miniAppLoading.value = false;

      mountMiniApp();
      checkLevelUp();
    }

    const redirectApp = async (start_param: string) => {
      if (start_param === 'p_home') { router.push('/'); }
      if (start_param === 'p_tasks') { router.push('/tasks'); }
      if (start_param === 'p_leaderboard') { router.push('/leaderboard'); }
      if (start_param === 'p_wallet') { router.push('/wallet'); }
      if (start_param === 'p_friends') { router.push('/friends'); }
    }

    const showEruda = async (user_id: number) => {
      const allowedIds = [799631929, 2106187940, 769703344, 7274565407];
      if (allowedIds.includes(user_id)) {
        localStorage.setItem('showErudaT', '1');
      } else {
        localStorage.removeItem('showErudaT');
      }
    }

    onMounted(async () => {
      const isAuthenticated = await authenticate();

      if (isAuthenticated.status && isAuthenticated.status === 'banned') {
        onAppLoad();
        appCache.UserData = isAuthenticated.message;
        router.push({ name: 'banned' });
        return;
      }

      if (isAuthenticated.status && isAuthenticated.status === 'error') {
        onAppLoad();
        router.push({ name: 'error' });
        return;
      }

      if (isAuthenticated) {
        const userGet = await userApi.get();
        const placesGet = await placesApi.get();
        const tasksGet = await tasksApi.get();
        const gameGet = await gamesApi.get();

        appCache.UserData = { ...userGet };
        appCache.PlacesData = { ...placesGet };
        appCache.GameData = { ...gameGet } as GameDataType;

        appCache.TasksData.Banners = [ ...tasksGet.banners ];
        appCache.TasksData.Referrals = [ ...tasksGet.referrals ];
        appCache.TasksData.Tasks = [ ...tasksGet.tasks ];

        showEruda(userGet.telegram_id);

        if (isAuthenticated.status) {
          setNewPlaceStore(isAuthenticated.status);
          
          router.push({ 
            name: 'onborad', 
            params: { type: isAuthenticated.status }
          });
          
          if (userGet) { onAppLoad(); }
        } else {
          if (userGet) {
            onAppLoad();
            redirectApp(initDataUnsafe.value.start_param);
          }
        }
      }
    });

    const onRouterViewLoaded = () => {
      miniAppLoading.value = false;
      loadingPage.value = false;
    };

    return {
      loadingPage,
      pageSuccess,
      miniAppLoading,
      initDataRaw,
      onRouterViewLoaded
    };
  },

  data() {
    return {
      RouterViewLoaded: false,
    };
  },

  mounted() {
    this.$i18n.locale = getCurrentLanguage(this.initDataRaw.language);
  },

  methods: {
    initMenu() {
      const excludedRoutes: Array<string | null> = [
        'onborad', 'place', 'friends-upgrade', 'level-up', 'error', 'banned'
      ];
      return !excludedRoutes.includes(this.$route.name?.toString() || '');
    }
  },
};
</script>

<style lang="scss">
@use '@/assets/styles/main.scss' as *;
@use '@/assets/styles/fonts.scss' as *;
</style>