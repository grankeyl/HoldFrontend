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
              v-for="(task, i) in TasksData" :key="i"
              class="contextTasksItemsItem"
              :style="{ animationDelay: `${i * 0.27}s` }"
            >
              <div class="contextTasksItemsItemDeep">
                <img 
                  :src="task.condition_value.ChannelPhoto"
                  alt="image"
                  class="fade-in"
                  @load="onImageLoad"
                >
              </div>
              <div class="contextTasksItemsItemContent">
                <div slot="reward" class="contextTasksItemsItemContentTitle">
                  <h4>Подписаться в Телеграм</h4>
                </div>
                <div slot="reward" class="contextTasksItemsItemContentReward">
                  <span>+{{ task.reward_value }}</span>
                  <IconComp 
                    :icon="Icon.Token"
                    width="16px"
                    height="16px"
                  />
                </div>
              </div>
              <div v-if="task.isLoading" slot="button" class="contextTasksItemsItemButton loading">
                <button @click="clickTask(task)">
                  <div class="loader-button"></div>
                </button>
              </div>
              <div v-if="!task.isLoading && !task.isClaimed && !task.isDone" slot="button" class="contextTasksItemsItemButton">
                <button @click="clickTask(task)">
                  <span>Старт</span>
                </button>
              </div>
              <div v-if="!task.isLoading && task.isClaimed && !task.isDone" slot="button" class="contextTasksItemsItemButton claim">
                <button @click="useTask(task)">
                  <span>Забрать</span>
                </button>
              </div>
              <div v-if="!task.isLoading && task.isClaimed && task.isDone" slot="button" class="contextTasksItemsItemButton done">
                <button>
                  <span>Готово</span>
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
import { toast } from 'vue3-toastify';
import { collectConfetti } from '@/utils/useConfetti';

// @ts-ignore
import 'swiper/css';

import * as tasksApi from '@/api/services/tasks.service';
import * as telegramApi from '@/api/services/telegram.service';

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

      isCheckSubscribeChannelInterval: false,
      checkSubscribeChannelInterval: null as any,
      checkSubscribeChannelTimeout: null as any,
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

    startCheckSubscribeChannel(ChannelId: any) {
      return new Promise((resolve) => {
        this.isCheckSubscribeChannelInterval = true;

        this.checkSubscribeChannelInterval = setInterval(async () => {
          const data = await telegramApi.checkUserChannel({ channel_id: ChannelId });
          if (data.status === "success") {
            this.stopCheckSubscribeChannel();
            resolve(true);
          }
        }, 2000);

        this.checkSubscribeChannelTimeout = setTimeout(() => {
          this.stopCheckSubscribeChannel();
          resolve(false);
        }, 30000);
      });
    },

    stopCheckSubscribeChannel() {
      if (this.checkSubscribeChannelInterval) clearInterval(this.checkSubscribeChannelInterval);
      if (this.checkSubscribeChannelTimeout) clearTimeout(this.checkSubscribeChannelTimeout);
      this.isCheckSubscribeChannelInterval = false;
    },

    async clickTask(task: any) {
      const taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }

      if (task.condition_type === "SubscribeChannel") {
        if (this.isCheckSubscribeChannelInterval) return;

        taskToUpdate.isLoading = true;
        const check = await this.startCheckSubscribeChannel(task.condition_value.ChannelId);

        if (check) {
          taskToUpdate.isLoading = false;
          await this.useTask(task);
        }
      }
    },
    
    async useTask(task: any) {
      let isClaimed = task.isClaimed;
      let isDone = task.isDone;

      const taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }

      if (task.condition_type === "SubscribeChannel") {
        isClaimed = true;
        taskToUpdate.isClaimed = true;
        taskToUpdate.isDone = isDone;
      }

      if (isClaimed && !isDone) { isDone = true; }

      const use = await tasksApi.use({ 
        taskId: task.id,
        taskProgress: { isClaimed, isDone }
      });

      if (!use) { return; }

      console.log("use:", use);

      if (use.status === "already_received") {
        toast.error(`Вы уже выполнили это задание`);
        return;
      }

      if (use.status === "claimed") {
        taskToUpdate.isClaimed = true;
        taskToUpdate.isDone = false;
      }

      if (use.status === "done") {
        taskToUpdate.isClaimed = true;
        taskToUpdate.isDone = true;

        appCache.UserData.balance += use.tickets;

        collectConfetti();
        toast.success(`Вы успешно заработали ${use.tickets} токенов`);
      }
    }
  },
};
</script>

<style scoped lang="scss">
@use './Tasks.scss' as *;
</style>