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
    class="_wrap _friends" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_friendsSymbols no-animation">
      <img 
        src="/friends/background-symbols.png"
        alt="background-symbols"
        class="fade-in"
        @load="onImageLoad"
      />
      <div class="nulled"></div>
    </div>

    <div class="_view">
      <div class="context">

        <div class="contextTitle">
          <IconComp
            :icon="Icon.Friends"
            width="27px"
            height="27px"
            pathColor="#fff"
          />
          <h4>Друзья</h4>
          {{ ReferralsList }}
        </div>
        
        <div class="contextInfo">
          <div class="contextInfoLeft">
            <div class="contextInfoLeftLabel">
              <h4>Доход в час:</h4>
            </div>
            <div class="contextInfoLeftTitle">
              <span>{{ ReferralsInfo.ReferralsMoneyToHour }}</span>
              <IconComp 
                :icon="Icon.Token"
                width="20px"
                height="20px"
              />
            </div>
          </div>
          <div class="contextInfoCenter">
            <div class="contextInfoCenterImage">
              <img 
                src="/friends/rabs.png"
                alt="rabs"
                class="fade-in"
                @load="onImageLoad"
              />
            </div>
            <div class="contextInfoCenterTitle">
              <h1><strong>{{ UserData.referrals_count }}</strong> Рабов</h1>
            </div>
          </div>
          <div class="contextInfoRight">
            <div class="contextInfoLeftLabel">
              <h4>Всего собрано:</h4>
            </div>
            <div class="contextInfoLeftTitle">
              <span>{{ ReferralsInfo.ReferralsMoneyAll }}</span>
              <IconComp 
                :icon="Icon.Token"
                width="20px"
                height="20px"
              />
            </div>
          </div>
        </div>

        <div class="contextButtons">
          <div class="contextButtonsButton">
            <button>
              <IconComp 
                :icon="Icon.Link"
                width="24px"
                height="24px"
              />
              <span>Поймать раба</span>
            </button>
          </div>
          <div v-if="ReferralsInfo.ReferralsCountCurrent > 0" class="contextButtonsButton primary">
            <button @click="openUpgrade(1)">
              <IconComp 
                :icon="Icon.Up"
                width="24px"
                height="24px"
              />
              <span>Улучшить всех</span>
            </button>
          </div>
        </div>

        <div class="contextReward">
          <div class="contextRewardLeft">
            <div class="contextRewardLeftImage">
              <img 
                src="/friends/money.png"
                alt="money"
                class="fade-in"
                @load="onImageLoad"
              />
            </div>
            <div class="contextRewardLeftContext">
              <div class="contextRewardLeftContextLabel">
                <h4>Скоплено</h4>
              </div>
              <div class="contextRewardLeftContextTitle">
                <span>{{ ReferralsInfo.ReferralsMoneyTake }}</span>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                />
              </div>
            </div>
          </div>
          <div class="contextRewardBorder"></div>
          <div class="contextRewardRight">
            <div class="contextRewardRightButton">
              <button>
                <span>Собрать</span>
              </button>
            </div>
          </div>
        </div>
 
        <div v-if="ReferralsInfo.ReferralsCountCurrent > 0" class="contextFriendsItems">
          <div 
            v-for="(referral, i) in ReferralsList" :key="i" 
            class="contextFriendsItemsItem" 
            :style="{ animationDelay: `${i * 0.07}s` }"
          >
            <div class="contextFriendsItemsItemDeep">
              <img 
                src="/friends/rab-1.png"
                alt="rab-1"
                class="fade-in"
                @load="onImageLoad"
              />
              <span class="contextFriendsItemsItemDeepLevel">{{ referral.ref_level }}</span>
            </div>
            <div class="contextFriendsItemsItemContent">
              <div class="contextFriendsItemsItemContentTitle">
                <h4>{{ referral.full_name }}</h4>
              </div>
              <div class="contextFriendsItemsItemContentReward">
                <span>+{{ referral.tokens_per_hour }}</span>
                <IconComp 
                  :icon="Icon.Token"
                  width="16px"
                  height="16px"
                />
                <span>/час</span>
              </div>
            </div>
            <div class="contextFriendsItemsItemRewarding">
              <div class="contextFriendsItemsItemRewardingLabel">
                <h4>Принес вам</h4>
              </div>
              <div class="contextFriendsItemsItemRewardingTitle">
                <span>{{ referral.tokens_to_get }}</span>
                <IconComp 
                  :icon="Icon.Token"
                  width="21px"
                  height="21px"
                />
              </div>
            </div>
            <div class="contextFriendsItemsItemButton claim">
              <button @click="openUpgrade(1)">
                <span>Улучшить</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="ReferralsInfo.ReferralsCountCurrent === 0" class="contextFriendsNull">
          <strong>Пригласи друзей, чтобы превратить их в своих рабов и поднять золотишка</strong>
        </div>

      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';

import * as userApi from '@/api/services/user.service'

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

      ReferralsList: [] as any,
      ReferralsInfo: {
        ReferralsMoneyToHour: 0,
        ReferralsMoneyToHourCurrent: 0,
        ReferralsMoneyAll: 0,
        ReferralsMoneyAllCurrent: 0,

        ReferralsCountCurrent: 1,

        ReferralsMoneyTake: 0,
        ReferralsMoneyTakeCurrent: 0,
      },

      UserData: appCache.UserData,

      Icon,
    };
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/');
    });
    
    this.waitForAssets();

    if (this.initReferralsInfo()) {
      this.animateReferralsToHour();
      this.animateReferralsAll();
      this.animateReferralsProgress();

      this.getReferralsList();
    }
  },

  methods: {
    onImageLoad(event: Event) {
      const img = event.target as HTMLImageElement;
      img.classList.add('loaded');
    },

    async waitForAssets() {
      const fontPromise = document.fonts?.ready ?? Promise.resolve();
      const imagePromises = [
        '/friends/background-symbols.png',
        '/friends/rabs.png',
        '/friends/rab-1.png',
        '/friends/money.png',
        '/tasks/banner-1.png',
        '/tasks/ferm-banner-1.png',
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
    
    animateReferralsToHour() {
      this.ReferralsInfo.ReferralsMoneyToHour = 0;
      const target = this.ReferralsInfo.ReferralsMoneyToHourCurrent;
      const step = Math.max(1, Math.floor(target / 100));

      const interval = setInterval(() => {
        this.ReferralsInfo.ReferralsMoneyToHour += step;

        if (this.ReferralsInfo.ReferralsMoneyToHour >= target) {
          this.ReferralsInfo.ReferralsMoneyToHour = target;
          clearInterval(interval);
        }
      }, 10);
    },

    animateReferralsAll() {
      this.ReferralsInfo.ReferralsMoneyAll = 0;
      const target = this.ReferralsInfo.ReferralsMoneyAllCurrent;
      const step = Math.max(1, Math.floor(target / 100));

      const interval = setInterval(() => {
        this.ReferralsInfo.ReferralsMoneyAll += step;

        if (this.ReferralsInfo.ReferralsMoneyAll >= target) {
          this.ReferralsInfo.ReferralsMoneyAll = target;
          clearInterval(interval);
        }
      }, 35);
    },
    
    animateReferralsProgress() {
      this.ReferralsInfo.ReferralsMoneyTake = 0;
      const target = this.ReferralsInfo.ReferralsMoneyTakeCurrent;
      const step = Math.max(1, Math.floor(target / 100));

      const interval = setInterval(() => {
        this.ReferralsInfo.ReferralsMoneyTake += step;

        if (this.ReferralsInfo.ReferralsMoneyTake >= target) {
          this.ReferralsInfo.ReferralsMoneyTake = target;
          clearInterval(interval);
        }
      }, 30);
    },

    openHome() {
      this.$router.push('/');
    },

    openUpgrade(id: number) {
      this.$router.push(`/friends/upgrade/${id}`);
    },

    initReferralsInfo() {
      this.ReferralsInfo.ReferralsMoneyTakeCurrent = 12800;
      this.ReferralsInfo.ReferralsMoneyToHourCurrent = 3200;
      this.ReferralsInfo.ReferralsMoneyAllCurrent = 12000;

      return true;
    },

    async getReferralsList() {
      const result = await userApi.getReferrals({
        offset: 0,
        limit: 20,
      });

      this.ReferralsList = result;
    }
  },
};
</script>

<style scoped lang="scss">
@use './Friends.scss' as *;
</style>