<template>
  <section 
    class="_wrap _levelup" 
    :class="{ show: !IsPageLoading }"
  >
    
    <div class="_levelupSymbols">
      <img 
        src="/levelup/background-symbols.png" 
        alt="background-symbols" 
        class="fade-in"
        @load="onImageLoad"
      />
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextInfo">

          <div class="contextInfoLevel">
            <div class="contextInfoLevelOld">
              <div class="contextInfoLevelOldTitle">
                <h4>I Village</h4>
              </div>
            </div>

            <div class="contextInfoLevelSwap">
              <IconComp
                :icon="Icon.ArrowRight"
                width="24px"
                height="24px"
              />
            </div>

            <div class="contextInfoLevelNew">
              <div class="contextInfoLevelNewTitle">
                <h4>II Town</h4>
              </div>
            </div>
          </div>

          <div class="contextInfoImage">
            <img 
              src="/levelup/shield1.png"
              alt="shield1"
              class="fade-in"
              @load="onImageLoad"
            />
            <div class="contextInfoImageInfo">
              <IconComp
                :icon="Icon.Friends"
                width="28px"
                height="28px"
              />
              <span>20</span>
            </div>
          </div>

          <div class="contextInfoDescription">
            <h4>
              You now earn
              <span>+5%</span>
              more from your servants
            </h4>
          </div>
        </div>

      </div>
    </div>

    <div class="buttons">
      <div class="buttonsButton ads">
        <button @click="openHome()">
          <div class="bg">
            <img
              src="/friends/upgrade/ads.png"
              alt="ads"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <span>Okay</span>
        </button>
      </div>
      <div class="buttonsButton">
        <button
          @click="shareStory()"
          :class="{ loading: ShareStoryButtonLoading }"
        >
          <IconComp 
            :icon="Icon.ArrowRightTo"
            width="24px"
            height="24px"
          />
          <span>Share to stories</span>
          <strong>
            <p>+23,000</p>
            <IconComp 
              :icon="Icon.Token"
              width="16px"
              height="16px"
            />
          </strong>
          <div class="loader-button"></div>
        </button>
      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';

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
    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      ShareStoryButtonLoading: false,

      Icon,
    };
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/friends');
    });
    
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
        '/levelup/background-symbols.png',
        '/levelup/shield1.png',
        '/friends/upgrade/ads.png',
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
      this.$router.push('/');
    },

    shareStory() {
      this.ShareStoryButtonLoading = true;

      TelegramModule.useShareStory(import.meta.env.VITE_APP_STORIES_PREMIUM)
        .then(async (status) => {
          if (status) {
            setTimeout(() => {
              this.ShareStoryButtonLoading = true;
            }, 6440);
          }
        })
        .catch(() => {
          this.ShareStoryButtonLoading = false;
        });
    }
  },
};
</script>

<style scoped lang="scss">
@use './LevelUp.scss' as *;
</style>