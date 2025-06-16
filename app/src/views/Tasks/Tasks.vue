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
    class="_wrap _tasks" 
    :class="{ show: !IsPageLoading }"
  >

    <Modal
      :isVisible="ShareReferralModal"
      @update:isVisible="ShareReferralModal = $event"
    >
      <div class="modalTitle">
        <IconComp
          :icon="Icon.Friends"
          width="22px"
          height="22px"
        /> 
        <h4 v-html="$t('Modal.CatchSlave.Title')"></h4>
      </div>
      
      <div class="modalDescription">
        <p v-html="$t('Modal.CatchSlave.Description')"></p>
      </div>

      <div class="modalReferral">
        <h4>{{ ReferralLink }}</h4>
        <div 
          @click="copyShareReferral(ReferralLink)"
          class="modalReferralCopy"
        >
          <p>{{ ShareReferralCopied ? $t('Modal.CatchSlave.Copied') : $t('Modal.CatchSlave.Copy') }}</p>
        </div>
      </div>

      <div class="modalButton">
        <button @click="sendShareReferral()">
          <IconComp 
            :icon="Icon.ArrowRightTo"
            width="24px"
            height="24px"
          />
          <span v-html="$t('Modal.CatchSlave.Button')"></span>
        </button>
      </div>
    </Modal>

    <div class="_view">
      <div class="context">

        <div class="contextTitle">
          <IconComp
            :icon="Icon.CircleFull"
            width="27px"
            height="27px"
            pathColor="#fff"
          />
          <h4 v-html="$t('Tasks.Title')"></h4>
        </div>

        <div class="contextBanners">
          <swiper v-bind="SwiperBannersOptions">
            <swiper-slide v-for="(task, i) in BannersData" :key="i">
              <div class="contextBannersBanner">
                <div class="contextBannersBannerReward">
                  <span>+{{ task.reward_value }}</span>
                  <IconComp 
                    :icon="Icon.Token"
                    width="12px"
                    height="12px"
                  />
                </div>
                <div class="contextBannersBannerBg">
                  <img 
                    :src="task.condition_value.BannerUrl"
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
                    <h1 v-if="$i18n.locale === 'en'">{{ task.condition_value.BannerTitle }}</h1>
                    <h1 v-if="$i18n.locale === 'ru'">{{ task.condition_value.BannerTitleRu }}</h1>
                  </div>
                  <div v-if="task.isLoading" slot="button" class="contextBannersBannerContentButton loading">
                    <button>
                      <div class="loader-button"></div>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && !task.isClaimed && !task.isDone" slot="button" class="contextBannersBannerContentButton">
                    <button @click="clickTask(task, 'Banner')">
                      <span v-html="$t('Tasks.Subscribe')"></span>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && task.isClaimed && !task.isDone" slot="button" class="contextBannersBannerContentButton claim">
                    <button @click="claimTask(task, 'Banner')">
                      <span v-html="$t('Tasks.Claim')"></span>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && task.isClaimed && task.isDone" slot="button" class="contextBannersBannerContentButton done">
                    <button>
                      <IconComp 
                        :icon="Icon.Done"
                        width="12px"
                        height="12px"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <div class="contextFerm">
          <div class="contextFermTitle">
            <h4 v-html="$t('Tasks.SlaveFarm')"></h4>
          </div>

          <swiper v-bind="SwiperRabsOptions">
            <swiper-slide v-for="(task, i) in ReferralsData" :key="i">
              <div class="contextBannersBanner">
                <div class="contextBannersBannerReward">
                  <span>+{{ task.reward_value }}</span>
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
                    <h1 v-html="$t('Tasks.InviteFriends', { referrals: task.condition_value.ReferralsCount })"></h1>
                    <span>
                      {{ Math.min(task.condition_value.ReferralsCount, UserData.referrals_count) }}/{{ task.condition_value.ReferralsCount }}
                    </span>
                  </div>

                  <div v-if="task.isLoading" slot="button" class="contextBannersBannerContentButton loading">
                    <button>
                      <div class="loader-button"></div>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && !task.isClaimed && !task.isDone" slot="button" class="contextBannersBannerContentButton">
                    <button @click="openShareReferral()">
                      <span v-html="$t('Tasks.Invite')"></span>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && task.isClaimed && !task.isDone" slot="button" class="contextBannersBannerContentButton claim">
                    <button @click="claimTask(task)">
                      <span v-html="$t('Tasks.Claim')"></span>
                    </button>
                  </div>
                  <div v-if="!task.isLoading && task.isClaimed && task.isDone" slot="button" class="contextBannersBannerContentButton done">
                    <button>
                      <IconComp 
                        :icon="Icon.Done"
                        width="12px"
                        height="12px"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        
        <div class="contextTasks">
          <div class="contextTasksTitle">
            <h4>{{ $t('Tasks.Partners') }}</h4>
          </div>

          <div class="contextTasksItems">
            <AdsgramTask
              v-for="(task, i) in TasksAdsgram"
              :key="i"
              :rewardAmount="GameData.ads.task"
              :dataBlockId="task"
              :dataDebug="false"
            />
          </div>
        </div>

        <TraffyTasks
          :rewardAmount="GameData.ads.task"
        />
        
        <div class="contextTasks">
          <div class="contextTasksTitle socials">
            <h4 v-html="$t('Tasks.Socials')"></h4>
          </div>

          <div class="contextTasksItems">
            <div 
              v-for="(task, i) in TasksData" :key="i"
              class="contextTasksItemsItem"
              :style="{ animationDelay: `${i * 0.27}s` }"
            >
              <div v-if="task.condition_type !== 'Stories'" class="contextTasksItemsItemDeep">
                <img 
                  :src="task.condition_value.PhotoUrl"
                  alt="image"
                  class="fade-in"
                  @load="onImageLoad"
                >
              </div>
              <div v-if="task.condition_type === 'Stories'" class="contextTasksItemsItemDeep stories">
                <IconComp
                  :icon="Icon.Repost"
                  width="27px"
                  height="27px"
                />
              </div>
              <div class="contextTasksItemsItemContent">
                <div slot="reward" class="contextTasksItemsItemContentTitle">
                  <h4 v-if="task.condition_type === 'SubscribeChannel'">{{ task.condition_value.ChannelName }}</h4>
                  <h4 v-if="task.condition_type === 'JoinMiniapp'">{{ task.condition_value.MiniAppName }}</h4>
                  <h4 v-if="task.condition_type === 'JoinSite'">{{ task.condition_value.SiteName }}</h4>
                  <h4 v-if="task.condition_type === 'Stories' && $i18n.locale === 'ru'">{{ task.condition_value.stories_ru }}</h4>
                  <h4 v-if="task.condition_type === 'Stories' && $i18n.locale === 'en'">{{ task.condition_value.stories }}</h4>
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
                <button>
                  <div class="loader-button"></div>
                </button>
              </div>
              <div v-if="!task.isLoading && !task.isClaimed && !task.isDone && task.condition_type !== 'Stories'" slot="button" class="contextTasksItemsItemButton">
                <button @click="clickTask(task)">
                  <span v-html="$t('Tasks.Start')"></span>
                </button>
              </div>
              <div v-if="!task.isLoading && !task.isClaimed && !task.isDone && task.condition_type === 'Stories' && !task.cooldown" slot="button" class="contextTasksItemsItemButton">
                <button @click="clickTask(task)">
                  <span v-html="$t('Tasks.Start')"></span>
                </button>
              </div>
              <div v-if="!task.isLoading && task.isClaimed && !task.isDone" slot="button" class="contextTasksItemsItemButton claim">
                <button @click="claimTask(task)">
                  <span v-html="$t('Tasks.Claim')"></span>
                </button>
              </div>
              <div v-if="!task.isLoading && task.isClaimed && task.isDone && task.condition_type !== 'Stories'" slot="button" class="contextTasksItemsItemButton done">
                <button>
                  <IconComp 
                    :icon="Icon.Done"
                    width="12px"
                    height="12px"
                  />
                </button>
              </div>
              <div
                v-if="!task.isLoading && task.condition_type === 'Stories' && task.cooldown > 0"
                class="contextTasksItemsItemButton done"
              >
                <button class="stories">
                  <span>{{ task.cooldownTimeLeft || '00:00' }}</span>
                </button>
              </div>
            </div>
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
import { copyToClipboard, getReferralLink } from '@/utils/useApp';
import { getCurrentInstance } from 'vue';

// @ts-ignore
import 'swiper/css';

import * as tasksApi from '@/api/services/tasks.service';
import * as telegramApi from '@/api/services/telegram.service';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal/Modal.vue';
import AdsgramTask from '@/components/AdsgramTask/AdsgramTaskWrapper.vue';
import TraffyTasks from '@/components/Task/Task.vue';

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
    AdsgramTask,
    TraffyTasks,
    Modal,
  },

  setup() {
    const { proxy } = getCurrentInstance()! as any;

    return {
      proxy,
    };
  },

  data() {
    const appCache = AppCache();

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

      ShareReferralModal: false,
      ShareReferralCopied: false,

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
      BannersData: appCache.TasksData.Banners,
      ReferralsData: appCache.TasksData.Referrals,
      TasksData: appCache.TasksData.Tasks,

      isCheckSubscribeChannelInterval: false,
      checkSubscribeChannelInterval: null as any,
      checkSubscribeChannelTimeout: null as any,
    };
  },

  computed: {
    ReferralLink() {
      return getReferralLink(this.UserData.referral_code);
    },
  },

  mounted() {
    TelegramModule.hideBackButton();

    this.waitForAssets(); 
    this.animateReferralsProgress();
  },

  watch: {
    TasksData: {
      handler(newTasks: any[]) {
        newTasks?.forEach((task: any) => {
          if (
            task.condition_type === 'Stories' &&
            task.cooldown &&
            !task._cooldownStarted
          ) {
            task._cooldownStarted = true;
            console.log(task)
            this.initCooldown(task);
          }
        });
      },
      immediate: true,
      deep: true
    }
  },

  beforeUnmount() {
    this.TasksData.forEach(task => {
      if (task.cooldownInterval) {
        clearInterval(task.cooldownInterval);
      }
    });
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

    initCooldown(task: any) {
      const cooldownSeconds = Number(task.cooldown);
      const targetTime = Math.floor(Date.now() / 1000) + cooldownSeconds;

      const updateCooldown = () => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = targetTime - now;

        if (remaining <= 0) {
          task.cooldownTimeLeft = '00:00:00';
          clearInterval(task.cooldownInterval);
          return;
        }

        const hours = Math.floor(remaining / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
        const seconds = (remaining % 60).toString().padStart(2, '0');

        task.cooldownTimeLeft = `${hours}:${minutes}:${seconds}`;
      };

      updateCooldown();
      task.cooldownInterval = setInterval(updateCooldown, 1000);
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

    async useTaskSubscribeChannel(task: any, type?: string) {
      const appCache = AppCache();

      let taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (type && type === 'Banner') {
        taskToUpdate = this.BannersData.find((t: any) => String(t.id) === String(task.id));
      }

      if (!taskToUpdate) { return; }
      
      if (task.isClaimed && !task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: false }
        });

        console.log(use);

        if (use.status === "claimed") {
          task.isClaimed = true;
          task.isDone = false;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = false;
          TelegramModule.useMediumHaptic();
        }
      }

      if (task.isClaimed && task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: true }
        });

        if (use.status === "done") {
          task.isClaimed = true;
          task.isDone = true;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = true;

          collectConfetti();
          TelegramModule.useMediumHaptic();

          appCache.UserData.balance += use.tickets;
          toast.success(this.proxy.$t('Toasts.SuccessEarnTokens', { tokens: use.tickets }));
        }
      }
    },

    async useTaskJoinMiniApp(task: any) {
      const appCache = AppCache();

      const taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }
      
      if (task.isClaimed && !task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: false }
        });

        if (use && use.status === 'claimed') {
          task.isClaimed = true;
          task.isDone = false;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = false;

          TelegramModule.useMediumHaptic();
        }
      }

      if (task.isClaimed && task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: true }
        });

        if (use && use.status === 'done') {
          taskToUpdate.isLoading = true;

          task.isClaimed = true;
          task.isDone = true;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = true;

          collectConfetti();
          TelegramModule.useMediumHaptic();

          appCache.UserData.balance += use.tickets;
          toast.success(this.proxy.$t('Toasts.SuccessEarnTokens', { tokens: use.tickets }));

          taskToUpdate.isLoading = false;
        }
      }
    },

    async useTaskJoinSite(task: any) {
      const appCache = AppCache();
      
      const taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }
      
      if (task.isClaimed && !task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: false }
        });

        if (use && use.status === 'claimed') {
          task.isClaimed = true;
          task.isDone = false;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = false;

          TelegramModule.useMediumHaptic();
        }
      }

      if (task.isClaimed && task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: true }
        });

        if (use && use.status === 'done') {
          taskToUpdate.isLoading = true;

          task.isClaimed = true;
          task.isDone = true;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = true;

          collectConfetti();
          TelegramModule.useMediumHaptic();

          appCache.UserData.balance += use.tickets;
          toast.success(this.proxy.$t('Toasts.SuccessEarnTokens', { tokens: use.tickets }));

          taskToUpdate.isLoading = false;
        }
      }
    },

    async useStories(task: any) {
      const appCache = AppCache();
      
      const taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }
      
      if (task.isClaimed && !task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: false }
        });

        if (use && use.status === 'claimed') {
          task.isClaimed = true;
          task.isDone = false;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = false;

          TelegramModule.useMediumHaptic();
        }
      }

      if (task.isClaimed && task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: true }
        });

        if (use && use.status === 'done') {
          taskToUpdate.isLoading = true;

          task.isClaimed = true;
          task.isDone = true;
          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = true;

          collectConfetti();
          TelegramModule.useMediumHaptic();

          appCache.UserData.balance += use.tickets;
          toast.success(this.proxy.$t('Toasts.SuccessEarnTokens', { tokens: use.tickets }));

          taskToUpdate.isLoading = false;

          task._cooldownStarted = true;
          task.cooldown = 43200;
          this.initCooldown(task);
        }
      }
    },

    async useTaskRefCount(task: any) {
      const appCache = AppCache();

      const taskToUpdate = this.ReferralsData.find((t: any) => String(t.id) === String(task.id));
      if (!taskToUpdate) { return; }

      if (task.isClaimed && task.isDone) {
        const use = await tasksApi.use({ 
          taskId: task.id,
          taskProgress: { isClaimed: true, isDone: true }
        });

        if (use && use.status === 'done') {
          taskToUpdate.isLoading = true;

          task.isClaimed = true;
          task.isDone = true;

          taskToUpdate.isClaimed = true;
          taskToUpdate.isDone = true;

          collectConfetti();
          TelegramModule.useMediumHaptic();

          appCache.UserData.balance += use.tickets;
          toast.success(this.proxy.$t('Toasts.SuccessEarnTokens', { tokens: use.tickets }));

          taskToUpdate.isLoading = false;
        }
      }
    },

    async clickTask(task: any, type?: any) {
      let taskToUpdate = this.TasksData.find((t: any) => String(t.id) === String(task.id));

      if (type && type === 'Banner') {
        taskToUpdate = this.BannersData.find((t: any) => String(t.id) === String(task.id));
      }

      if (!taskToUpdate) { return; }
      if (task.isClaimed) { return; }

      if (task.condition_type === "SubscribeChannel") {
        taskToUpdate.isLoading = true;

        TelegramModule.useLink(task.condition_value.ChannelLink);
        const check = await this.startCheckSubscribeChannel(
          task.condition_value.ChannelId
        );

        if (check) { 
          task.isClaimed = true;
          taskToUpdate.isClaimed = true;
          this.useTaskSubscribeChannel(task, type);
        }

        taskToUpdate.isLoading = false;
      }

      if (task.condition_type === 'JoinMiniapp') {
        taskToUpdate.isLoading = true;

        TelegramModule.useLink(task.condition_value.MiniAppLink);

        setTimeout(() => { 
          task.isClaimed = true;
          taskToUpdate.isClaimed = true;

          const check = this.useTaskJoinMiniApp(task) as any;
          if (check) { taskToUpdate.isLoading = false; }
        }, 2680);
      }

      if (task.condition_type === 'JoinSite') {
        taskToUpdate.isLoading = true;

        window.open(task.condition_value.SiteLink, '_blank');

        setTimeout(() => { 
          task.isClaimed = true;
          taskToUpdate.isClaimed = true;

          const check = this.useTaskJoinSite(task) as any;
          if (check) { taskToUpdate.isLoading = false; }
        }, 2680);
      }

      if (task.condition_type === 'Stories') {
        let StoryImage = import.meta.env.VITE_APP_STORIES_TASK_EN;

        if (this.$i18n.locale === 'ru') {
          StoryImage = import.meta.env.VITE_APP_STORIES_TASK_RU;
        }

        const language = this.$i18n.locale;
        const referralLink = getReferralLink(this.UserData.referral_code);

        taskToUpdate.isLoading = true;

        TelegramModule.useShareStory(
          StoryImage,
          language, referralLink
        )
          .then(async (status) => {
            if (status) {
              setTimeout(() => { 
                task.isClaimed = true;
                taskToUpdate.isClaimed = true;

                const check = this.useStories(task) as any;
                if (check) { taskToUpdate.isLoading = false; }
              }, 6680);
            }
          })
          .catch(() => {
            taskToUpdate.isLoading = false;
          });
      }
    },

    async claimTask(task: any, type?: any) {
      if (task.condition_type === 'SubscribeChannel') {
        if (task.isClaimed && task.isDone) {
          TelegramModule.useLink(task.condition_value.ChannelLink);
          return;
        };

        setTimeout(() => {
          task.isClaimed = true;
          task.isDone = true;

          this.useTaskSubscribeChannel(task, type);
        }, 200);
      }

      if (task.condition_type === 'JoinMiniapp') {
        setTimeout(() => {
          task.isClaimed = true;
          task.isDone = true;

          this.useTaskJoinMiniApp(task);
        }, 200);
      }

      if (task.condition_type === 'JoinSite') {
        setTimeout(() => {
          task.isClaimed = true;
          task.isDone = true;

          this.useTaskJoinSite(task);
        }, 200);
      }
    
      if (task.condition_type === 'RefCount') {
        setTimeout(() => {
          task.isClaimed = true;
          task.isDone = true;

          this.useTaskRefCount(task);
        }, 200);
      }

      if (task.condition_type === 'Stories') {
        setTimeout(() => {
          task.isClaimed = true;
          task.isDone = true;

          this.useStories(task);
        }, 200);
      }
    },

    openShareReferral() {
      this.ShareReferralModal = true;
      TelegramModule.useMediumHaptic();
    },
    
    copyShareReferral(text: string) {
      if (this.ShareReferralCopied) return;

      copyToClipboard(text);
      this.ShareReferralCopied = true;
      TelegramModule.useMediumHaptic();

      setTimeout(() => {
        this.ShareReferralCopied = false;
      }, 1500);
    },

    sendShareReferral() {
      const link = this.ReferralLink;
      const text = this.$i18n.locale === 'ru' ? 
      '🔗 Ты стал рабом. Проверьте, или вы пожалеете об этом.' : 
      "🔗 You've become a slave. Check or you'll regret it.";

      TelegramModule.useSendMessage(link, text);
      TelegramModule.useMediumHaptic();
    },
  },
};
</script>

<style lang="scss">
@use './Tasks.scss' as *;
@use '@/components/Modal/Modal.scss' as *;
</style>