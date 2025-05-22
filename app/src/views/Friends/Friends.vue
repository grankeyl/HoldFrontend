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
        <h4>Catch a slave</h4>
      </div>
      
      <div class="modalDescription">
        <p>Copy the link or share directly</p>
      </div>

      <div class="modalReferral">
        <h4>{{ ReferralLink }}</h4>
        <div 
          @click="copyShareReferral(ReferralLink)"
          class="modalReferralCopy"
        >
          <p>{{ ShareReferralCopied ? 'Copied!' : 'Copy' }}</p>
        </div>
      </div>

      <div class="modalButton">
        <button @click="sendShareReferral()">
          <IconComp 
            :icon="Icon.ArrowRightTo"
            width="24px"
            height="24px"
          />
          <span>Share</span>
        </button>
      </div>
    </Modal>

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
        </div>
        
        <div class="contextInfo">
          <div class="contextInfoLeft">
            <div class="contextInfoLeftLabel">
              <h4>Доход в час:</h4>
            </div>
            <div class="contextInfoLeftTitle">
              <span>{{ toUniqNumber(ReferralsInfo.ReferralsMoneyToHour) }}</span>
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
              <span>{{ toUniqNumber(ReferralsInfo.ReferralsMoneyAll) }}</span>
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
            <button @click="openShareReferral()">
              <IconComp 
                :icon="Icon.Link"
                width="24px"
                height="24px"
              />
              <span>Поймать раба</span>
            </button>
          </div>
          <div v-if="FriendsData && UserData.referrals_count > 0" class="contextButtonsButton primary">
            <button @click="openUpgrade('all')" :class="{ loading: LoadingUpgradeAllButton }">
              <IconComp 
                :icon="Icon.Up"
                width="24px"
                height="24px"
              />
              <span>Улучшить всех</span>
              <div class="loader-button"></div>
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
                <span>{{ toUniqNumber(ReferralsInfo.ReferralsMoneyTake) }}</span>
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
              <button @click="collectReferral()" :disabled="ReferralsInfo.ReferralsMoneyTake === 0">
                <span>Собрать</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="FriendsData && FriendsData.length > 0" class="contextFriendsItems">
          <div 
            v-for="(referral, i) in FriendsData" :key="i" 
            class="contextFriendsItemsItem" 
            :style="{ animationDelay: `${i * 0.07}s` }"
            :ref="(el: any) => i === FriendsData.length - 1 ? setLastFriendRef(el) : null"
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
                <span>+{{ toUniqNumber(referral.tokens_per_hour) }}</span>
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
                <span>{{ toUniqNumber(referral.tokens_to_get) }}</span>
                <IconComp 
                  :icon="Icon.Token"
                  width="21px"
                  height="21px"
                />
              </div>
            </div>
            <div class="contextFriendsItemsItemButton claim">
              <button @click="openUpgrade('user', referral.user_id)">
                <span>Улучшить</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="FriendsData && FriendsData.length === 0" class="contextFriendsNull">
          <strong>Пригласи друзей, чтобы превратить их в своих рабов и поднять золотишка</strong>
        </div>

      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';
import { copyToClipboard, getReferralLink } from '@/utils/useApp';
import { collectConfetti } from '@/utils/useConfetti';
import { toUniqNumber } from '@/utils/useGame';

import * as friendsApi from '@/api/services/friends.service';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue';
import Loader from '@/components/Loader.vue';
import Modal from '@/components/Modal/Modal.vue';

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
    Modal,
  },

  data() {
    const appCache = AppCache();

    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      FriendsData: [] as any,
      FriendsOffset: 0,
      FriendsLimit: 10,
      FriendsObserver: null as IntersectionObserver | null,
      LastFriendRef: null as HTMLElement | null,

      ShareReferralModal: false,
      ShareReferralCopied: false,

      ReferralsInfo: {
        ReferralsMoneyToHour: 0,
        ReferralsMoneyToHourCurrent: 0,
        ReferralsMoneyAll: 0,
        ReferralsMoneyAllCurrent: 0,

        ReferralsCountCurrent: 1,

        ReferralsMoneyTake: 0,
        ReferralsMoneyTakeCurrent: 0,
      },

      LoadingUpgradeAllButton: false,

      UserData: appCache.UserData,

      Icon,
      toUniqNumber,
    };
  },

  computed: {
    ReferralLink() {
      return getReferralLink(this.UserData.referral_code);
    },
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/');
    });
    
    this.waitForAssets();
    this.fetchFriends();
  },

  watch: {
    LastFriendRef(newEl) {
      if (newEl) {
        this.initObserver();
      }
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

    initReferralsInfo(dto: {
      ReferralsMoneyTakeCurrent: number,
      ReferralsMoneyToHourCurrent: number,
      ReferralsMoneyAllCurrent: number,
    }) {
      this.ReferralsInfo.ReferralsMoneyTakeCurrent = dto.ReferralsMoneyTakeCurrent;
      this.ReferralsInfo.ReferralsMoneyToHourCurrent = dto.ReferralsMoneyToHourCurrent;
      this.ReferralsInfo.ReferralsMoneyAllCurrent = dto.ReferralsMoneyAllCurrent;

      this.animateReferralsToHour();
      this.animateReferralsAll();
      this.animateReferralsProgress();
      
      return true;
    },

    animateReferralsToHour() {
      const duration = 1250;
      const start = performance.now();
      const from = 0;
      const to = this.ReferralsInfo.ReferralsMoneyToHourCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        this.ReferralsInfo.ReferralsMoneyToHour = Math.floor(from + (to - from) * progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },

    animateReferralsAll() {
      const duration = 1250;
      const start = performance.now();
      const from = 0;
      const to = this.ReferralsInfo.ReferralsMoneyAllCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        this.ReferralsInfo.ReferralsMoneyAll = Math.floor(from + (to - from) * progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
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
      }, 6);
    },

    openHome() {
      this.$router.push('/');
    },

    openUpgrade(type: 'all' | 'user', user_id?: number) {
      if (type === 'all') {
        this.LoadingUpgradeAllButton = true;
        this.$router.push({ 
          name: 'friends-upgrade', 
          params: { user_id: 0 }
        });
      } else if (type === 'user') {
        this.$router.push({ 
          name: 'friends-upgrade', 
          params: { user_id }
        });
      }
    },

    async fetchFriendsInfo() {
      const response = await friendsApi.get({
        offset: Number(this.FriendsOffset),
        limit: Number(this.FriendsLimit),
      });

      if (response && response.referrals?.length) {
        this.FriendsData.push(...response.referrals);
        this.FriendsOffset += this.FriendsLimit;
      } else {
        this.FriendsObserver?.disconnect();
      }
    },
    
    async fetchFriends() {
      const response = await friendsApi.get({
        offset: Number(this.FriendsOffset),
        limit: Number(this.FriendsLimit),
      });

      if (response && response.referrals?.length) {
        this.initReferralsInfo({
          ReferralsMoneyTakeCurrent: response.total_income,
          ReferralsMoneyToHourCurrent: response.tokens_per_hour,
          ReferralsMoneyAllCurrent: response.total_collected,
        });
        this.FriendsData.push(...response.referrals);
        this.FriendsOffset += this.FriendsLimit;
      } else {
        this.FriendsObserver?.disconnect();
      }
    },

    setLastFriendRef(el: HTMLElement | any) {
      this.LastFriendRef = el;
    },

    initObserver() {
      this.FriendsObserver?.disconnect();
      if (!this.LastFriendRef) return;

      this.FriendsObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) this.fetchFriends();
      }, { root: null, rootMargin: '0px', threshold: 1.0 });

      this.FriendsObserver.observe(this.LastFriendRef);
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
      const text = "123"
      TelegramModule.useMediumHaptic();
      TelegramModule.useSendMessage(link, text);
    },

    addTotalCollected() {
      const duration = 600;
      const start = performance.now();
      const from = this.ReferralsInfo.ReferralsMoneyAll;
      const to = this.ReferralsInfo.ReferralsMoneyAllCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        this.ReferralsInfo.ReferralsMoneyAll = Math.floor(from + (to - from) * progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },

    async collectReferral() {
      const collect = await friendsApi.collect({});
      if (!collect) { return; }
      
      this.UserData.balance = collect.new_balance;

      this.ReferralsInfo.ReferralsMoneyTake = 0;
      this.ReferralsInfo.ReferralsMoneyTakeCurrent = 0;

      this.ReferralsInfo.ReferralsMoneyAllCurrent = collect.total_collected;
      this.FriendsData.forEach((referral: any) => { referral.tokens_to_get = 0; });
      this.addTotalCollected();

      collectConfetti();
    }
  },
};
</script>

<style scoped lang="scss">
@use './Friends.scss' as *;
@use '@/components/Modal/Modal.scss' as *;
</style>