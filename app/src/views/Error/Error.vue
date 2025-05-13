<template>
  <section 
    class="_wrap _error" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_errorSymbols no-animation">
      <img 
        src="/error/bg.png"
        alt="bg"
        class="fade-in"
        @load="onImageLoad"
      />
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextImage">
          <img 
            src="/error/link.png"
            alt="coin"
            class="fade-in"
            @load="onImageLoad"
          />
        </div>

        <div class="contextTitle">
          <h4>Произошла ошибка</h4>
        </div>

        <div class="contextDescrption">
          <p>Попробуйте еще раз </p>
        </div>

      </div>
    </div>
  </section>

  <div class="button">
    <button @click="openHome()">
      <IconComp 
        :icon="Icon.TowerBlack"
        width="22px"
        height="22px"
      />
      <span>Вернуться домой</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue'

const appCache = AppCache() as any;

export default {
  props: {
    success: {
      type: Boolean,
      required: true,
    }
  },

  components: {
    IconComp,
    Loader,
  },

  data() {
    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      UserData: appCache.UserData,

      Icon,
    };
  },

  mounted() {
    TelegramModule.hideBackButton();
    
    this.waitForAssets();
  },

  methods: {
    onImageLoad(event: Event) {
      const img = event.target as HTMLImageElement;
      img.classList.add('loaded');
    },

    async waitForAssets() {
      const fontPromise = document.fonts?.ready ?? Promise.resolve();
      const imagePromises = [
        '/wallet/coin.png',
      ].map(src => new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      }));

      await Promise.all([fontPromise, ...imagePromises]);

      this.IsPageLoading = false;
      this.$emit('loaded');
    },

    openHome() {
      location.href = '/';
      TelegramModule.useMediumHaptic();
    },
  },
};
</script>

<style scoped lang="scss">
@use './Error.scss' as *;
</style>