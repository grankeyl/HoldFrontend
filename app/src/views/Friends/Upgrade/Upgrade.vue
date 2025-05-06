<template>
  <div class="head-balance">
    <h4>{{ UserData.balance }}</h4>
    <IconComp 
      :icon="Icon.Token"
      width="16px"
      height="16px"
    />
  </div>

  <section 
    class="_wrap _upgrade" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_upgradeSymbols">
      <img 
        src="/friends/upgrade/background-symbols.png"
        alt="background-symbols"
        class="fade-in"
        @load="onImageLoad"
      />
      <div class="nulled"></div>
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextInfo">
          <div class="contextInfoTitle">
            <h4 v-if="PageType !== 'all'">Улучшить</h4>
            <h4 v-if="PageType === 'all'">Улучшить всех рабов</h4>
          </div>
          <div class="contextInfoImage">
            <img 
              src="/friends/upgrade/rab-1.png"
              alt="rab-1"
              class="fade-in"
              @load="onImageLoad"
            />
            <span v-if="PageType !== 'all'">malen_kihuy</span>
          </div>
          <div class="contextInfoLevel">

            <div v-if="PageType !== 'all'" class="contextInfoLevelOld">
              <div class="contextInfoLevelOldTitle">
                <span>10</span>
                <h4>Уровень</h4>
              </div>
              <div class="contextInfoLevelOldDescription">
                <p>/час</p>
              </div>
            </div>

            <div v-if="PageType === 'all'" class="contextInfoLevelOld">
              <div class="contextInfoLevelOldTitle">
                <h4>Доход сейчас</h4>
              </div>
              <div class="contextInfoLevelOldDescription">
                <h4>111,000</h4>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                  pathColor="#AAAAAA"
                />
                <p>/час</p>
              </div>
            </div>

            <div class="contextInfoLevelSwap">
              <IconComp
                :icon="Icon.ArrowRight"
                width="24px"
                height="24px"
              />
            </div>

            <div v-if="PageType !== 'all'" class="contextInfoLevelNew">
              <div class="contextInfoLevelNewTitle">
                <span>10</span>
                <h4>Уровень</h4>
              </div>
              <div class="contextInfoLevelNewDescription">
                <h4>1,000</h4>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                  pathColor="#AAAAAA"
                />
                <p>/час</p>
              </div>
            </div>

            <div v-if="PageType === 'all'" class="contextInfoLevelNew">
              <div class="contextInfoLevelNewTitle">
                <h4>Доход после</h4>
              </div>
              <div class="contextInfoLevelNewDescription">
                <h4>211,000</h4>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                  pathColor="#AAAAAA"
                />
                <p>/час</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <div class="buttons">
      <div class="buttonsButton">
        <button>
          <IconComp 
            :icon="Icon.Up"
            width="24px"
            height="24px"
          />
          <span>Улучшить</span>
          <strong>
            <p>3,000</p>
            <IconComp 
              :icon="Icon.Token"
              width="16px"
              height="16px"
            />
          </strong>
        </button>
      </div>
      <div class="buttonsButton ads">
        <button>
          <div class="bg">
            <img 
              src="/friends/upgrade/ads.png"
              alt="ads"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <span>Улучшить за полцены</span>
          <svg width="43" height="44" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_dddddd_8110_12039)">
            <path d="M26.6199 19.3998L19.3799 15.2198C18.4529 14.6846 17.3111 14.6838 16.3834 15.2178C15.4557 15.7517 14.8828 16.7394 14.8799 17.8098V26.1898C14.8828 27.2602 15.4557 28.2479 16.3834 28.7818C17.3111 29.3158 18.4529 29.315 19.3799 28.7798L26.6199 24.5998C27.55 24.0644 28.1232 23.073 28.1232 21.9998C28.1232 20.9266 27.55 19.9352 26.6199 19.3998Z" fill="white"/>
            </g>
            <defs>
            <filter id="filter0_dddddd_8110_12039" x="-5.01525" y="-4.51525" width="53.0305" height="53.0305" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.172801"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8110_12039"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.345601"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_8110_12039" result="effect2_dropShadow_8110_12039"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="1.2096"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect2_dropShadow_8110_12039" result="effect3_dropShadow_8110_12039"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2.41921"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect3_dropShadow_8110_12039" result="effect4_dropShadow_8110_12039"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="4.14722"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect4_dropShadow_8110_12039" result="effect5_dropShadow_8110_12039"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="7.25763"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 0 0.478431 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect5_dropShadow_8110_12039" result="effect6_dropShadow_8110_12039"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow_8110_12039" result="shape"/>
            </filter>
            </defs>
          </svg>
        </button>
      </div>
    </div>

  </section>
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

      PageType: 'slave',

      UserData: appCache.UserData,

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
        '/friends/upgrade/background-symbols.png',
        '/friends/upgrade/rab-1.png',
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
  },
};
</script>

<style scoped lang="scss">
@use './Upgrade.scss' as *;
</style>