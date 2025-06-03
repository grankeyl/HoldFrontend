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
                <h4>{{ toRoman(LevelUpData.OldLevelId) }} {{ LevelUpData.OldLevelName }}</h4>
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
                <h4>{{ toRoman(LevelUpData.NewLevelId) }} {{ LevelUpData.NewLevelName }}</h4>
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
              <span>{{ LevelUpData.FriendsCount }}</span>
            </div>
          </div>

          <div class="contextInfoDescription">
            <h4 v-html="$t('LevelUp.Description', { percents: LevelUpData.Percents })"></h4>
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
          <span v-html="$t('LevelUp.Button')"></span>
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
          <span v-html="$t('LevelUp.ButtonStories')"></span>
          <strong v-if="!ShareStoryRewarded">
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
import { AppCache } from '@/stores/pinia';
import { getPlacesData } from '@/utils/usePlaces';
import { getCurrentInstance } from 'vue';
import { toRoman } from '@/utils/useGame';
import { getReferralLink } from '@/utils/useApp';
import { toast } from 'vue3-toastify';
import { collectConfetti } from '@/utils/useConfetti';

import * as adsApi from '@/api/services/ads.service';

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

  setup() {
    const { proxy } = getCurrentInstance()! as any;

    return {
      proxy,
    };
  },

  data() {
    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      ShareStoryButtonLoading: false,
      ShareStoryRewarded: false,

      LevelUpData: {
        OldLevelId: 1,
        OldLevelName: 'Village',
        NewLevelId: 2,
        NewLevelName: 'City',
        FriendsCount: 0,
        Percents: 0,
      },

      UserData: appCache.UserData,
      PlacesData: appCache.PlacesData,

      PlacesListData: getPlacesData() as any,
      
      Icon,

      toRoman,
    };
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/friends');
    });
    
    this.waitForAssets();
    this.initLevelUp();
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

    async rewardStory() {
      const result = await adsApi.complete({ reward_token: localStorage.getItem('share_to_stories_token') || '' });
      if (!result) return;

      if (result.status === "error") {
        toast.error(this.proxy.$t('Toasts.ErrorStories'));
        return;
      }

      if (result.status === "success") {
        this.ShareStoryRewarded = true;
        this.ShareStoryButtonLoading = false;

        this.UserData.balance = result.new_balance;

        collectConfetti();
        TelegramModule.useMediumHaptic();
      }
    },

    shareStory() {
      const language = this.$i18n.locale;
      const referralLink = getReferralLink(this.UserData.referral_code);

      this.ShareStoryButtonLoading = true;

      TelegramModule.useShareStory(
        import.meta.env.VITE_APP_STORIES_PREMIUM,
        language, referralLink
      )
        .then(async (status) => {
          if (status) {
            if (this.ShareStoryRewarded) {
              this.ShareStoryButtonLoading = false;
              return;
            }

            const adUse = await adsApi.request({ task_type: "share_to_stories" });
            if (!adUse) return;

            console.log('✅ adUse', adUse);

            if (adUse.status === "error" && adUse.message.type === 'too_soon') {
              toast.error(this.proxy.$t('Toasts.ErrorStories'));
              return;
            }

            const adToken = adUse.reward_token;
            localStorage.setItem('share_to_stories_token', adToken);

            setTimeout(async () => {
              await this.rewardStory();
              this.ShareStoryButtonLoading = false;
            }, 6440);
          }
        })
        .catch(() => {
          this.ShareStoryButtonLoading = false;
        });
    },

    initLevelUp() {
      const placesArray = Object.values(this.PlacesListData);
      const foundPlace = placesArray.find(
        (place: any) => place.id === this.UserData.place.place_id - 1
      ) as { name?: string, nameEn?: string } | undefined;

      let oldName = '';
      let newName = '';

      if (this.proxy.$i18n.locale === 'ru') {
        oldName = foundPlace?.name as any;
        this.LevelUpData.OldLevelName = oldName;
      } else {
        oldName = foundPlace?.nameEn as any;
        this.LevelUpData.OldLevelName = oldName;
      }

      this.LevelUpData.OldLevelId = this.UserData.place.place_id - 1;
      this.LevelUpData.OldLevelName = oldName;

      this.LevelUpData.NewLevelId = this.UserData.place.place_id;

      const placeType = this.UserData.place.place_type;

      if (this.proxy.$i18n.locale === 'ru') {
        newName = this.PlacesListData[placeType]?.name;
        this.LevelUpData.NewLevelName = newName;
      } else {
        newName = this.PlacesListData[placeType]?.nameEn;
        this.LevelUpData.NewLevelName = newName;
      }

      this.LevelUpData.FriendsCount = this.UserData.referrals_count;
      this.LevelUpData.Percents = this.PlacesData[this.UserData.place.place_id].percents_add;
    }
  },
};
</script>

<style scoped lang="scss">
@use './LevelUp.scss' as *;
</style>