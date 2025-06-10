<template>
  <div class="head head-logotype">
    <img src="/logotype.svg" alt="logotype" />

    <div @click="openLanguageModal()" ref="languageBtnRef" class="language">
      <IconComp
        :icon="Icon.Network"
        width="24px"
        height="24px"
      />
    </div>

    <div ref="languageSelectRef" class="language-select" :class="{ active: IsActiveLanguageModal }">
      <div @click="setLanguage('ru')" class="language-select-item">
        <div class="language-select-item-image">
          <img src="/home/ru.png" alt="RU">
        </div>
        <div class="language-select-item-text">
          <p>RU</p>
          <div v-if="$i18n.locale === 'ru'" class="selected">
            <IconComp
              :icon="Icon.Selected"
              width="17px"
              height="17px"
            />
          </div>
        </div>
      </div>
      <div @click="setLanguage('en')" class="language-select-item">
        <div class="language-select-item-image">
          <img src="/home/en.png" alt="EN">
        </div>
        <div class="language-select-item-text">
          <p>EN</p>
          <div v-if="$i18n.locale === 'en'" class="selected">
            <IconComp
              :icon="Icon.Selected"
              width="17px"
              height="17px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <section 
    class="_wrap _home" 
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

    <div class="_homeSymbols no-animation">
      <img v-if="SlavedPage" 
        src="/places/slaved.webp" 
        alt="bg"
        class="fade-in"
        @load="onImageLoad"
      />
      <img v-if="!SlavedPage" 
        :src="PlacesListData[UserPlace.place_type].photo"
        alt="bg"
        class="fade-in"
        @load="onImageLoad"
      />
      <div class="nulled"></div>
    </div>

    <div class="_view">
      <div class="context">

        <div 
          v-if="SlavedPage"
          @click="openPlace()"
          class="contextLocation"
        >
          <div class="icon-wrapper">
            <img 
              class="chains-small fade-in" 
              src="/home/chains-small.webp"
              alt="chains-small"
              @load="onImageLoad"
            />
            <div class="kit-icon" v-html="Icon.InfoSmall"></div>
          </div>
          <p v-html="$t('Place.Slaved', { name: UserData.refer_name })"></p>
        </div>

        <div 
          v-if="!SlavedPage" 
          @click="openPlace()"
          class="contextLocation"
        >
          <div class="icon-wrapper">
            <img 
              :src="PlacesListData[UserPlace.place_type].icon" 
              alt="icon"
              class="fade-in"
              @load="onImageLoad"
            />
            <div class="kit-icon" v-html="Icon.InfoSmall"></div>
          </div>
          <p>
            <strong v-if="$i18n.locale === 'en'">
              {{ toRoman(UserPlace.place_id) }}
              {{ PlacesListData[UserPlace.place_type].nameEn }}
            </strong>
            
            <strong v-if="$i18n.locale === 'ru'">
              {{ toRoman(UserPlace.place_id) }}
              {{ PlacesListData[UserPlace.place_type].name }}
            </strong>
          </p>
          <span v-if="!HasNextPlace">
            <IconComp
              :icon="Icon.Friends"
              width="23px"
              height="23px"
            />
            <p>{{ UserProgress.ReferralsCountCurrent }}</p>
          </span>
        </div>

        <div v-if="HasNextPlace" class="contextProgress" ref="linesWrapper">
          <div class="contextProgressLeft">
            <div class="kit-icon" v-html="Icon.Friends"></div>
          </div>

          <div class="contextProgressProccess">
            <div class="contextProgressProccessLines">
              <div 
                v-for="index in UserProgressTotalLines" 
                :key="'line-' + index" 
                class="contextProgressProccessLinesLined"
              >
                <div 
                  :class="[
                    'contextProgressProccessLinesLine',
                    { primary: index <= FilledLines }
                  ]"
                >
                  <template v-if="index === FilledLines">
                    <div class="contextProgressProccessLinesLineLast" :class="{ lasting: !HasNextPlace }">
                      <p>{{ UserProgress.ReferralsCountCurrent }}</p>
                    </div>
                  </template>
                </div>
                <div
                  v-if="index === UserProgressTotalLines && HasNextPlace"
                  class="contextProgressProccessLinesLineAll"
                >
                  <p>{{ UserProgress.ReferralsCountNeed }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contextProgressRight">
            <img 
              :src="PlacesListData[UserProgress.NextPlaceType].icon"
              alt="icon"
              class="fade-in"
              @load="onImageLoad"
            />
            <p>{{ toRoman(UserProgress.NextPlaceId) }}</p>
          </div>
        </div>

        <div class="contextInfo">
          <div class="contextInfoBalance">
            <div class="contextInfoBalanceLabel">
              <p v-if="SlavedPage" v-html="$t('Home.BeforePayoff')"></p>
              <p v-if="!SlavedPage" v-html="$t('Home.YourTreasury')"></p>
            </div>
            <div class="contextInfoBalanceTitle">
              <h1>{{ toUniqNumber(GameInfo.Balance) }}</h1>
              <div class="kit-icon" v-html="Icon.Token"></div>
            </div>
          </div>

          <div @click="showAds()" class="contextInfoVideo" ref="ContextInfoVideo">
            <div class="contextInfoBg">
              <!-- <img 
                src="https://telegram.blum.codes/_dist/animation.BRMCslGi.gif"
                alt="bg-video"
                class="fade-in"
                @load="onImageLoad"
              /> -->
              <img 
                src="/home/background-video.png"
                alt="bg-video"
                class="static fade-in"
                @load="onImageLoad"
              />
            </div>
            <div class="contextInfoContent">
              <div class="contextInfoVideoTitle">
                <h4 v-html="$t('Home.WatchAds')"></h4>
              </div>
              <div class="loader-button"></div>
              <div class="contextInfoVideoButton">
                <span>+{{ GameData.ads.video }}</span>
                <IconComp 
                  :icon="Icon.Token"
                  width="12px"
                  height="12px"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="SlavedPage" class="contextRabs">
          <img 
          src="/home/rabs.webp"
          alt="rabs"
          class="fade-in"
          @load="onImageLoad"
        />
          <p v-html="$t('Home.ConditionsForFreedom', { referrals: UserData.slaved_need_referrals })"></p>
        </div>

        <div v-if="!SlavedPage && UserData.referrals_count === 0" class="contextRabs">
          <img 
            src="/home/rabs.webp"
            alt="rabs"
            class="fade-in"
            @load="onImageLoad"
          />
          <p v-html="$t('Home.TurnFriends')"></p>
        </div>

        <div 
          v-if="!SlavedPage && UserData.referrals_count > 0"
          class="contextRabsReferrals"
        >
          <div @click="openFriends()" class="contextRabsReferralsLeft">
            <div class="contextRabsReferralsLeftTitle">
              <IconComp 
                :icon="Icon.Friends"
                width="16px"
                height="16px"
              />
              <h4 v-html="$t('Home.FriendsTitle')"></h4>
              <IconComp 
                :icon="Icon.ChevroneRight"
                width="16px"
                height="16px"
              />
            </div>
            <div class="contextRabsReferralsLeftDescription">
              <p v-html="$t('Home.FriendsDescription')"></p>
            </div>
            <div class="contextRabsReferralsLeftRabs">
              <div class="contextRabsReferralsLeftRabsImage">
                <img 
                  src="/home/rabs-two.webp"
                  alt="rabs"
                  class="fade-in"
                  @load="onImageLoad"
              />
              </div>
              <div class="contextRabsReferralsLeftRabsRight">
                <div class="contextRabsReferralsLeftRabsRightTitle">
                  <h4>
                    <span>{{ UserData.referrals_count }}</span>
                    {{ pluralize(UserData.referrals_count, $t('App.PluralizeSlaves')) }}
                  </h4>
                </div>
                <div class="contextRabsReferralsLeftRabsRightInfo">
                  <p>{{ GameInfo.ReferralsTokenPerHour }}</p>
                  <IconComp 
                    :icon="Icon.Token"
                    width="18px"
                    height="18px"
                  />
                  <p>/{{ $t('App.Hour') }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contextRabsReferralsBorder"></div>
          <div class="contextRabsReferralsRight">
            <div class="contextRabsReferralsRightLabel">
              <p v-html="$t('Home.Hoarded')"></p>
            </div>
            <div class="contextRabsReferralsRightTitle">
              <h4>{{ toUniqNumber(ReferralsInfo.ReferralsMoneyTakeCurrent) }}</h4>
              <IconComp 
                :icon="Icon.Token"
                width="20px"
                height="20px"
              />
            </div>
            <div class="contextRabsReferralsRightButton">
              <button @click="collectReferral()" :disabled="ReferralsInfo.ReferralsMoneyTakeCurrent === 0">
                <span v-html="$t('Home.Collect')"></span>
              </button>
            </div>
          </div>
        </div>

        <div class="contextRabsReferralsButton">
          <button @click="openShareReferral()">
            <IconComp 
              :icon="Icon.Link"
              width="24px"
              height="24px"
            />
            <span v-html="$t('Home.CatchSlave')"></span>
          </button>
        </div>
        
      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { ref } from 'vue';
import { AppCache } from '@/stores/pinia';
import { useAdsgram } from '@/utils/useAds';
import { Icon } from '@/components/Icons';
import { toast } from 'vue3-toastify';
import { toRoman, toUniqNumber } from '@/utils/useGame';
import { getPlacesData } from '@/utils/usePlaces';
import { copyToClipboard, getReferralLink, pluralize } from '@/utils/useApp';
import { collectConfetti } from '@/utils/useConfetti';
import { getCurrentInstance } from 'vue';

import * as adsApi from '@/api/services/ads.service';
import * as userApi from '@/api/services/user.service';
import * as friendsApi from '@/api/services/friends.service';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue';
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
    Modal,
  },

  created() {
    const appCache = AppCache()
    this.GameData = appCache.GameData
    this.UserPlace = appCache.UserData.place
    this.PlacesList = appCache.PlacesData
    this.UserData = appCache.UserData
  },

  setup() {
    const { proxy } = getCurrentInstance()! as any;
    const appCache = AppCache() as any;
    const UserData = appCache.UserData;

    const GameInfo = ref({
      Balance: 0,
      BalanceCurrent: 0,
      Level: 1,
      ReferralsTokenPerHour: 0,
    });

    if (UserData.balance >= 0) {
      UserData.is_slaved = false;
    }

    const ContextInfoVideo = ref<HTMLElement>();
    
    const AddBalanceAnimation = () => {
      const duration = 600;
      const start = performance.now();
      const from = GameInfo.value.Balance;
      const to = GameInfo.value.BalanceCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        GameInfo.value.Balance = Math.floor(from + (to - from) * progress);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };
    
    const onReward = async () => {
      if (ContextInfoVideo.value) {
        ContextInfoVideo.value.classList.remove('loading');
      }

      const result = await adsApi.complete({ reward_token: localStorage.getItem('ads_last') || '' });
      if (!result) { return; }

      if (result.type === 'no_cost') {
        toast.error(proxy.$t('Toasts.NotEnoughTokens', { tokens: result.value }));
        return;
      }

      GameInfo.value.BalanceCurrent = result.balance;

      appCache.$patch({
        UserData: {
          ...appCache.UserData,
          balance: result.balance,
        }
      });

      AddBalanceAnimation();
    };

    const onError = (result: any) => {
      if (ContextInfoVideo.value) {
        ContextInfoVideo.value.classList.remove('loading');
      }

      toast.warn(proxy.$t('Toasts.ErrorShowAds'));

      return result;
    };

    const showAds = async () => {
      if (!ContextInfoVideo.value) return;
      ContextInfoVideo.value.classList.add('loading');

      const adUse = await adsApi.request({ task_type: 'video' })
      if (!adUse) { onError(adUse); return; }

      const adToken = adUse.reward_token;
      localStorage.setItem('ads_last', adToken);

      const showAd = await useAdsgram({
        blockId: import.meta.env.VITE_APP_ADSGRAM_HOME_PAGE_VIDEO_BLOCK_ID,
        onReward,
        onError
      });

      await showAd();
    };

    return { 
      UserData,
      GameInfo,
      ContextInfoVideo,
      AddBalanceAnimation,
      showAds
    };
  },


  data() {
    const appCache = AppCache();

    return {
      IsActiveLanguageModal: false,

      GameData: appCache.GameData as any,
      UserPlace: appCache.UserData.place as any,
      PlacesList: appCache.PlacesData as any,
      UserData: appCache.UserData as any,

      Icon,
      toRoman,
      toUniqNumber,
      getReferralLink,
      pluralize,

      Slaved: true,
      ShareReferralModal: false,
      ShareReferralCopied: false,
      PropsSuccess: this.success,
      IsPageLoading: false,
      IntervalId: null as ReturnType<typeof setInterval> | null,

      ReferralsCount: 0,
      ReferralsCountNeed: 29,

      ReferralsInfo: {
        ReferralsCountCurrent: 0,
        ReferralsMoneyToHour: 0,
        ReferralsMoneyTake: 0,
        ReferralsMoneyTakeCurrent: 0
      },

      UserProgressTotalLines: 25,
      UserProgressCurrentAnimatedReferrals: 0,
      UserProgress: {
        ReferralsCountCurrent: 0,
        ReferralsCountNeed: 1,
        NextPlaceId: 0,
        NextPlaceType: 'village',
      },

      PlacesListData: getPlacesData() as any,
    }
  },

  computed: {
    ReferralLink(): string {
      return getReferralLink(this.UserData.referral_code);
    },

    SlavedPage(): boolean {
      return this.UserData.is_slaved;
    },

    HasNextPlace(): boolean {
      const nextId = this.UserPlace.place_id + 1;
      return !!this.PlacesList[nextId - 1];
    },

    FilledLines(): number {
      if (this.UserProgress.ReferralsCountNeed === 0) return 0;

      const ratio = this.UserProgressCurrentAnimatedReferrals / this.UserProgress.ReferralsCountNeed;
      const filled = Math.round(Math.min(ratio, 1) * this.UserProgressTotalLines);
      return this.UserProgress.ReferralsCountCurrent === 0 ? 1 : filled;
    },

    TrimmedPlacesList() {
      if (!this.PlacesList) return [];

      const placesArray = Object.entries(this.PlacesList).map(([id, place]: [string, any]) => ({
        i: id,
        id: place.id,
        type: place.type,
        referrals_need: place.referrals_need,
        percents_add: place.percents_add,
      }));
      
      return placesArray.slice(this.UserPlace.place_id).filter(
        place => place.type && place.referrals_need !== undefined
      );
    }
  },

  mounted() {
    TelegramModule.hideBackButton();

    this.$nextTick(async () => {
      this.cycleInitUserData() as any;

      const initGame = this.initGame();

      this.userProgressInit();
      this.animateReferralsProgress();

      if (initGame) {
        this.animateBalance();
      }

      this.getReferralsList().then(getFriends => {
        if (getFriends) {
          this.ReferralsInfo.ReferralsCountCurrent = this.UserData.referrals_count;
          this.ReferralsInfo.ReferralsMoneyTakeCurrent = getFriends.total_income;
          this.animateReferralsInfo();
        }
      });
    });

    this.$emit('loaded');
    this.$watch(() => this.UserData.balance, (newValue: number) => {
      if (this.UserData.is_slaved && newValue >= 0) {
        this.UserData.is_slaved = false;
        this.UserData.place.place_id = 1;
        this.UserData.place.place_type = 'village';
        // this.$router.push('/level-up');
        this.userProgressInit();
      }
    });
    
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    if (this.IntervalId) {
      clearInterval(this.IntervalId);
    }
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    onImageLoad(event: Event) {
      const img = event.target as HTMLImageElement;
      img.classList.add('loaded');
    },
    
    animateBalance() {
      const duration = 800;
      const start = performance.now();
      const from = 0;
      const to = this.GameInfo.BalanceCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        this.GameInfo.Balance = Math.floor(from + (to - from) * progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },

    animateReferralsProgress() {
      this.UserProgressCurrentAnimatedReferrals = 0;
      const target = this.UserProgress.ReferralsCountCurrent;
      const step = Math.max(1, Math.floor(target / 40));

      const interval = setInterval(() => {
        this.UserProgressCurrentAnimatedReferrals += step;
        if (this.UserProgressCurrentAnimatedReferrals >= target) {
          this.UserProgressCurrentAnimatedReferrals = target;
          clearInterval(interval);

          this.$nextTick(() => {
            const wrapper = this.$refs.linesWrapper as HTMLElement;
            if (wrapper) {
              wrapper.scrollTo({
                left: wrapper.scrollWidth,
                behavior: 'smooth',
              });
            }
          });
        }
      }, 15);
    },
    
    animateReferralsInfo() {
      const duration = 600;
      const start = performance.now();
      const from = 0;
      const to = this.ReferralsInfo.ReferralsMoneyTakeCurrent;

      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        this.ReferralsInfo.ReferralsMoneyTake = Math.floor(from + (to - from) * progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },

    openPlace() {
      TelegramModule.useSoftHaptic();
      this.$router.push(`/places`);
    },

    openFriends() {
      this.$router.push('/friends');
    },

    openWallet() {
      this.$router.push('/wallet');
    },

    openNewLevel() {
      this.$router.push('/level-up');
    },

    initGame() {
      const appCache = AppCache();
      this.GameInfo.BalanceCurrent = appCache.UserData.balance;
      this.GameInfo.Level = appCache.UserData.level + 1;
      this.GameInfo.ReferralsTokenPerHour = appCache.UserData.tokens_per_hour;
      return true;
    },

    async cycleInitUserData() {
      const appCache = AppCache();
      this.IntervalId = setInterval(async () => {
        const userGet = await userApi.get();

        if (userGet) {
          appCache.UserData = userGet;
        }
      }, 10000);
    },

    userProgressInit() {
      const appCache = AppCache();
      const userReferralsCountCurrent = appCache.UserData.referrals_count;
      const nextPlace = this.userProgressGetNext();

      this.UserProgress.ReferralsCountCurrent = userReferralsCountCurrent;
      this.UserProgress.ReferralsCountNeed = Math.max(
        userReferralsCountCurrent,
        nextPlace.placeNextNeedReferrals
      );
      this.UserProgress.NextPlaceId = nextPlace.placeNextId;
      this.UserProgress.NextPlaceType = nextPlace.placeNextType;

      if (this.UserData.is_slaved) {
        this.UserProgress.ReferralsCountCurrent = 0;
        this.UserProgress.ReferralsCountNeed = this.UserData.slaved_need_referrals;
        this.UserProgress.NextPlaceId = 0;
        this.UserProgress.NextPlaceType = 'village';
      }
    },

    userProgressGetNext() {
      const placeNextIdNew = this.UserPlace.place_id + 1;
      const placeNext = this.PlacesList[placeNextIdNew - 1];

      if (!placeNext) {
        return {
          placeNextId: this.UserPlace.place_id,
          placeNextType: this.UserPlace.place_type,
          placeNextNeedReferrals: this.UserProgress.ReferralsCountCurrent,
        };
      }

      return {
        placeNextId: placeNextIdNew,
        placeNextType: placeNext.type,
        placeNextNeedReferrals: placeNext.referrals_need,
      };
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

    async getReferralsList() {
      const result = await friendsApi.get({
        offset: 0,
        limit: 20,
      });
      if (!result) { return; }
      return result;
    },

    async collectReferral() {
      const collect = await friendsApi.collect({});
      if (!collect) { return; }
      
      this.GameInfo.BalanceCurrent = collect.new_balance;
      this.UserData.balance = collect.new_balance;
      this.AddBalanceAnimation();

      this.ReferralsInfo.ReferralsMoneyTake = 0;
      this.ReferralsInfo.ReferralsMoneyTakeCurrent = 0;

      collectConfetti();
    },

    openLanguageModal() {
      !this.IsActiveLanguageModal ? 
      this.IsActiveLanguageModal = true : 
      this.IsActiveLanguageModal = false;
      TelegramModule.useMediumHaptic();
    },

    setLanguage(lang: string) {
      this.$i18n.locale = lang;
      localStorage.setItem('language', lang);

      this.IsActiveLanguageModal = false;
      TelegramModule.useMediumHaptic();
    },

    handleClickOutside(event: MouseEvent) {
      const modal = this.$refs.languageSelectRef as HTMLElement;
      const button = this.$refs.languageBtnRef as HTMLElement;

      if (!modal || !button) return;

      const clickedOutside = !modal.contains(event.target as Node) && !button.contains(event.target as Node);

      if (clickedOutside) {
        this.IsActiveLanguageModal = false;
      }
    }
  },
};
</script>

<style scoped lang="scss">
@use './Home.scss' as *;
@use '@/components/Modal/Modal.scss' as *;
</style>