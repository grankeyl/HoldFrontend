<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { MenuJson } from './Menu';

import TelegramModule from '@/hooks/useTelegram';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['loaded']);

const openRoute = (routePath: string) => {
  if (routePath !== '/soon') {
    if (routePath === router.currentRoute.value.path) return;
    router.push(routePath);
    TelegramModule.useSoftHaptic();
  }
};
</script>

<template>
  <div class="menu">
    <div class="menu__inner">
      <div class="menu__routes">
        <div
          v-for="item in MenuJson"
          :key="item.Key"
          :class="['menu__route-wrapper', { active: route.path === item.Route }]"
        >
          <div @click="openRoute(item.Route)" class="menu__route">
            <div class="kit-icon" v-html="item.Icon"></div>
            <p v-if="$i18n.locale === 'en'">{{ item.Text }}</p>
            <p v-if="$i18n.locale === 'ru'">{{ item.TextRu }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use './Menu.scss' as *;
</style>