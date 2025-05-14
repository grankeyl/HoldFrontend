<template>
  <section 
    class="_wrap _tasks" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="head-balance">
      <h4>{{ UserData.balance }}</h4>
      <IconComp 
        :icon="Icon.Token"
        width="16px"
        height="16px"
      />
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextTitle">
          <IconComp
            :icon="Icon.CircleFull"
            width="27px"
            height="27px"
            pathColor="#fff"
          />
          <h4>Заработать</h4>
        </div>

        <div class="contextBanners">
          <swiper v-bind="SwiperBannersOptions">
            <swiper-slide v-for="index in 2" :key="index">
              <div class="contextBannersBanner">
                <div class="contextBannersBannerReward">
                  <span>+200</span>
                  <IconComp 
                    :icon="Icon.Token"
                    width="12px"
                    height="12px"
                  />
                </div>
                <div class="contextBannersBannerBg">
                  <img 
                    src="/tasks/banner-1.png"
                    alt="banner-1"
                    class="fade-in"
                    @load="onImageLoad"
                  />
                </div>
                <div class="contextBannersBannerContent">
                  <div class="contextBannersBannerContentTop">
                    <IconComp
                      :icon="Icon.Logotype"
                      width="32px"
                      height="10px"
                      pathColor="#EE5023"
                    />
                    <IconComp
                      :icon="Icon.Telegram"
                      width="11px"
                      height="11px"
                      pathColor="#EE5023"
                    />
                  </div>
                  <div class="contextBannersBannerContentTitle">
                    <h1>Как заработать на крипте?</h1>
                  </div>
                  <div class="contextBannersBannerContentButton">
                    <button>
                      <span>Подписаться</span>
                    </button>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <div class="contextFerm">
          <div class="contextFermTitle">
            <h4>Ферма Рабов</h4>
          </div>

          <swiper v-bind="SwiperRabsOptions">
            <swiper-slide v-for="index in 2" :key="index">
              <div class="contextBannersBanner">
                <div class="contextBannersBannerReward">
                  <span>+200</span>
                  <IconComp 
                    :icon="Icon.Token"
                    width="12px"
                    height="12px"
                  />
                </div>
                <div class="contextBannersBannerBg">
                  <img 
                    src="/tasks/ferm-banner-1.png"
                    alt="ferm-banner-1" 
                    class="fade-in"
                    @load="onImageLoad"
                  />
                </div>
                <div class="contextBannersBannerContent">
                  <div class="contextBannersBannerContentTitle">
                    <img 
                      src="/tasks/rabs.png"
                      alt="rabs" 
                      class="fade-in"
                      @load="onImageLoad"
                    />
                    <h1>Пригласите 5 человек</h1>
                    <span>0/5</span>
                  </div>
                  <div class="contextBannersBannerContentButton">
                    <button>
                      <span>Пригласить</span>
                    </button>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        
        <div class="contextTasks">
          <div class="contextTasksTitle">
            <h4>Socials</h4>
          </div>

          <div class="contextTasksItems">
            <div 
              v-for="(_, i) in TasksData" :key="i"
              class="contextTasksItemsItem"
              :style="{ animationDelay: `${i * 0.27}s` }"
            >
              <div class="contextTasksItemsItemDeep">
                <img src="/tasks/telegram.svg" alt="telegram" />
              </div>
              <div class="contextTasksItemsItemContent">
                <div slot="reward" class="contextTasksItemsItemContentTitle">
                  <h4>Подписаться в Телеграм</h4>
                </div>
                <div slot="reward" class="contextTasksItemsItemContentReward">
                  <span>+{{ GameData.ads.task }}</span>
                  <IconComp 
                    :icon="Icon.Token"
                    width="16px"
                    height="16px"
                  />
                </div>
              </div>
              <div slot="button" class="contextTasksItemsItemButton">
                <button>
                  <span>Старт</span>
                </button>
              </div>
            </div>

            <Task 
              v-for="(task, i) in TasksAdsgram"
              :key="i"
              :debug="false" 
              :blockId="task"
              :animationDelay="`${i * 0.27}s`"
              :rewardAmount="GameData.ads.task"
            />

          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import { AppCache } from '@/stores/pinia';

// @ts-ignore
import 'swiper/css';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue'
import Task from '@/components/Task/Task.vue';

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
    Swiper,
    SwiperSlide,
    Task,
  },

  data() {
    return {
      SwiperBannersOptions: {
        modules: [Autoplay],
        slidesPerView: 'auto',
        spaceBetween: 10,
        initialSlide: 0,
        autoplay: {
          delay: 2100,
          disableOnInteraction: false,
        },
        speed: 700,
      } as any,

      SwiperRabsOptions: {
        modules: [],
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlidesBounds: true,
        initialSlide: 0,
        speed: 700,
      } as any,

      PropsSuccess: this.success,
      IsPageLoading: false,

      ReferralsCount: 0,
      ReferralsCountNeed: 29,

      ReferralsInfo: {
        ReferralsCountCurrent: 20
      },

      TasksAdsgram: [
        import.meta.env.VITE_APP_ADSGRAM_TASK_1
      ] as any[],

      Icon,

      GameData: appCache.GameData,
      UserData: appCache.UserData,
      TasksData: appCache.TasksData,
    };
  },

  mounted() {
    TelegramModule.hideBackButton();
    
    this.waitForAssets(); 
    this.animateReferralsProgress();
  },

  methods: {
    onImageLoad(event: Event) {
      const img = event.target as HTMLImageElement;
      img.classList.add('loaded');
    },

    async waitForAssets() {
      const fontPromise = document.fonts?.ready ?? Promise.resolve();
      const imagePromises = [
        '/tasks/banner-1.png',
        '/tasks/ferm-banner-1.png',
        '/tasks/rabs.png',
        '/logotype.svg',
      ].map(src => new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      }));

      await Promise.all([fontPromise, ...imagePromises]);

      this.IsPageLoading = false;
      this.$emit('loaded');
    },
    
    animateReferralsProgress() {
      this.ReferralsCount = 0;
      const target = this.ReferralsInfo.ReferralsCountCurrent;
      const step = Math.max(1, Math.floor(target / 100));

      const interval = setInterval(() => {
        this.ReferralsCount += step;

        if (this.ReferralsCount >= target) {
          this.ReferralsCount = target;
          clearInterval(interval);
        }
      }, 10);
    },

    openHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped lang="scss">
@use './Tasks.scss' as *;
</style>