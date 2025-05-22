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

    <div v-if="PageLoading" class="_view">
      <div class="context">
        <div class="loader-button"></div>
      </div>
    </div>

    <div v-if="!PageLoading" class="_view">
      <div class="context">

        <div class="contextInfo">
          <div class="contextInfoTitle">
            <h4 v-if="PageType === 'all'">Улучшить всех рабов</h4>
            <h4 v-if="PageType === 'slave'">Улучшить</h4>
          </div>
          <div class="contextInfoImage">
            <img 
              src="/friends/upgrade/rab-1.png"
              alt="rab-1"
              class="fade-in"
              @load="onImageLoad"
            />
            <span v-if="PageType === 'slave'">{{ FriendData.name }}</span>
          </div>
          <div class="contextInfoLevel">

            <div v-if="PageType === 'all'" class="contextInfoLevelOld">
              <div class="contextInfoLevelOldTitle">
                <h4>Доход сейчас</h4>
              </div>
              <div class="contextInfoLevelOldDescription">
                <h4>{{ toUniqNumber(AllFriendsData.old_tokens_per_hour) }}</h4>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                  pathColor="#AAAAAA"
                />
                <p>/час</p>
              </div>
            </div>

            <div v-if="PageType === 'slave'" class="contextInfoLevelOld">
              <div class="contextInfoLevelOldTitle">
                <span>{{ FriendData.old_level }}</span>
                <h4>Уровень</h4>
              </div>
              <div class="contextInfoLevelOldDescription">
                <h4>{{ toUniqNumber(FriendData.old_tokens_per_hour) }}</h4>
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

            <div v-if="PageType === 'all'" class="contextInfoLevelNew">
              <div class="contextInfoLevelNewTitle">
                <h4>Доход после</h4>
              </div>
              <div class="contextInfoLevelNewDescription">
                <h4>{{ toUniqNumber(AllFriendsData.new_tokens_per_hour) }}</h4>
                <IconComp 
                  :icon="Icon.Token"
                  width="20px"
                  height="20px"
                  pathColor="#AAAAAA"
                />
                <p>/час</p>
              </div>
            </div>

            <div v-if="PageType === 'slave'" class="contextInfoLevelNew">
              <div class="contextInfoLevelNewTitle">
                <span>{{ FriendData.new_level }}</span>
                <h4>Уровень</h4>
              </div>
              <div class="contextInfoLevelNewDescription">
                <h4>{{ toUniqNumber(FriendData.new_tokens_per_hour) }}</h4>
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

  </section>

    <div class="buttons">
      <div class="buttonsButton">
        <button @click="upgrade()">
          <IconComp 
            :icon="Icon.Up"
            width="24px"
            height="24px"
          />
          <span>Улучшить</span>
          <strong v-if="!PageLoading">
            <p v-if="PageType === 'all'">{{ toUniqNumber(AllFriendsData.tokens_to_upgrade) }}</p>
            <p v-if="PageType === 'slave'">{{ toUniqNumber(FriendData.tokens_to_upgrade) }}</p>
            <IconComp 
              :icon="Icon.Token"
              width="16px"
              height="16px"
            />
          </strong>
          <strong v-if="PageLoading">
            <div class="loader-button"></div>
          </strong>
        </button>
      </div>
      <div class="buttonsButton ads">
        <button @click="upgradeAllAds()">
          <div class="bg">
            <img 
              src="/friends/upgrade/ads.png"
              alt="ads"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <span>Улучшить</span>
          <strong v-if="!PageLoading">
            <p v-if="PageType === 'all'">{{ toUniqNumber(AllFriendsData.tokens_to_upgrade_discount) }}</p>
            <p v-if="PageType === 'slave'">{{ toUniqNumber(FriendData.tokens_to_upgrade_discount) }}</p>
            <IconComp 
              :icon="Icon.Token"
              width="16px"
              height="16px"
            />
          </strong>
          <strong v-if="PageLoading">
            <div class="loader-button"></div>
          </strong>
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
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';
import { toast } from 'vue3-toastify';
import { collectConfetti } from '@/utils/useConfetti';
import { toUniqNumber } from '@/utils/useGame';

import * as friendsApi from '@/api/services/friends.service';
import * as adsApi from '@/api/services/ads.service';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue';
import { useAdsgram } from '@/utils/useAds';
import { useRouter } from 'vue-router';

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
      PageLoading: true,

      UserData: appCache.UserData,

      AllFriendsData: {
        id: 0,
        old_tokens_per_hour: 0,
        new_tokens_per_hour: 0,
        tokens_to_upgrade: 0,
        tokens_to_upgrade_discount: 0
      },

      FriendData: {
        id: 0,
        name: 'Empty',
        old_level: 0,
        new_level: 0,
        old_tokens_per_hour: 0,
        new_tokens_per_hour: 0,
        tokens_to_upgrade: 0,
        tokens_to_upgrade_discount: 0
      },

      Icon,

      toUniqNumber,
    };
  },

  setup() {
    const router = useRouter();

    const upgradeAll = async () => {
      const result = await adsApi.complete({ 
        reward_token: localStorage.getItem('ads_last_upgrade_friends') || ''
      });

      if (!result) { return; }

      if (result.status === "error" && result.type === 'no_cost') {
        toast.error(`Нехватает ${result.data.value} токена`);
      }

      if (result.status === "success") {
        collectConfetti();

        appCache.UserData.balance = result.new_balance;
        appCache.tokens_per_hour = result.tokens_per_hour;
        router.push('/friends');
      }
    }

    const upgradeAllAds = async () => {
      const adUse = await adsApi.request({ task_type: 'upgrade_friends' })
      if (!adUse) { return; }

      const adToken = adUse.reward_token;
      localStorage.setItem('ads_last_upgrade_friends', adToken);

      const onReward = () => upgradeAll();
      const onError = () => toast.error("Ошибка показа рекламы, попробуйте позже");

      const showAd = await useAdsgram({
        blockId: import.meta.env.VITE_APP_ADSGRAM_UPGRADE_PAGE_VIDEO_BLOCK_ID,
        onReward,
        onError
      });

      await showAd();
    };

    return {
      upgradeAllAds
    }
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/friends');
    });
    
    this.waitForAssets();
    this.initUpgradeFriend();
  },

  methods: {
    async initUpgradeFriend() {
      const params = this.$route.params as any;
      if (!params) { return; }

      const userId = Number(params.user_id);

      const getFriend = await friendsApi.upgradeGet({
        user_id: userId,
        type: userId === 0 ? 'all' : 'user'
      });
      if (!getFriend) { return; }

      if (userId === 0) {
        this.PageType = 'all';
        this.AllFriendsData.id = userId;
        this.AllFriendsData.old_tokens_per_hour = getFriend.old_tokens_per_hour;
        this.AllFriendsData.new_tokens_per_hour = getFriend.new_tokens_per_hour;
        this.AllFriendsData.tokens_to_upgrade = getFriend.tokens_to_upgrade;
        this.AllFriendsData.tokens_to_upgrade_discount = getFriend.discount_video;
        this.PageLoading = false;
        return;
      }

      this.PageType = 'slave';
      this.FriendData.id = userId;
      this.FriendData.name = getFriend.name;
      this.FriendData.old_level = getFriend.old_level;
      this.FriendData.new_level = getFriend.new_level;
      this.FriendData.old_tokens_per_hour = getFriend.old_tokens_per_hour;
      this.FriendData.new_tokens_per_hour = getFriend.new_tokens_per_hour;
      this.FriendData.tokens_to_upgrade = getFriend.tokens_to_upgrade;
      this.FriendData.tokens_to_upgrade_discount = getFriend.discount_video;
      this.PageLoading = false;
    },

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

    async upgrade() {
      const actionUpgrade = this.PageType === 'all' ? "all" : Number(this.FriendData.id);
      const result = await friendsApi.upgrade({
        action: actionUpgrade
      });

      if (!result) { return; }

      if (result.status === "error" && result.data.type === 'no_cost') {
        toast.error(`Нехватает ${result.data.value} токена`);
      }

      if (result.status === "success") {
        collectConfetti();

        this.UserData.balance = result.data.new_balance;
        this.UserData.tokens_per_hour = result.data.tokens_per_hour;
        this.$router.push('/friends');
      }
    }
  },
};
</script>

<style scoped lang="scss">
@use './Upgrade.scss' as *;
</style>