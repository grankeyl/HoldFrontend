<template>
  <section 
    class="_wrap _banned" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_bannedSymbols no-animation">
      <img 
        src="/banned/background.webp"
        alt="bg"
        class="fade-in"
        @load="onImageLoad"
      />
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextImage">
          <img 
            src="/banned/image.webp"
            alt="coin"
            class="fade-in"
            @load="onImageLoad"
          />
        </div>

        <div class="contextTitle">
          <h4 v-html="$t('Banned.Title')"></h4>
        </div>

        <div class="contextDescrption">
          <p v-if="$i18n.locale === 'en'">
            {{ UserData?.reason }}
          </p>
          <p v-if="$i18n.locale === 'ru'">
            {{ UserData?.reasonRu }}
          </p>
        </div>

      </div>
    </div>
  </section>

  <div class="button">
    <button @click="openContactSupport()">
      <IconComp 
        :icon="Icon.Question"
        width="19px"
        height="19px"
      />
      <span v-html="$t('Banned.Button')"></span>
    </button>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue'


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
    const appCache = AppCache() as any;

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

    openContactSupport() {
      const link = 'https://t.me/' + import.meta.env.VITE_APP_MINI_APP_SUPPORT_USERNAME.replace('@', '');
      TelegramModule.useLink(link);
      TelegramModule.useMediumHaptic();
    },
  },
};
</script>

<style scoped lang="scss">
@use './Banned.scss' as *;
</style>