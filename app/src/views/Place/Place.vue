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
    class="_wrap _place" 
    :class="{ show: !IsPageLoading }"
  >

    <div class="_placeSymbols no-animation">
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
      <div class="nulledTop"></div>
      <div class="nulled"></div>
    </div>

    <div class="_view">
      <div class="context">

        <div 
          v-if="SlavedPage"
          class="contextLocation"
        >
          <div class="icon-wrapper">
            <img 
              class="chains-small fade-in"
              src="/home/chains-small.png"
              alt="chains-small"
              @load="onImageLoad"
            />
          </div>
          <p v-html="$t('Place.Slaved', { name: UserData.refer_name })"></p>
        </div>

        <div 
          v-if="!SlavedPage" 
          class="contextLocation"
        >
          <div class="icon-wrapper">
            <img 
              :src="PlacesListData[UserPlace.place_type].icon"
              alt="icon"
              class="fade-in"
              @load="onImageLoad"
            />
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

        <div class="contextPlaces">
          <div 
            v-for="(place, index) in TrimmedPlacesList" :key="index"
            class="contextPlace" 
            :style="{ animationDelay: `${index * 0.31}s` }"
          >
            <div class="contextPlaceOverlay">
              <img 
                :src="PlacesListData[place.type].photo"
                alt="bg"
              />
              <div class="shadow"></div>
            </div>
            <div class="contextPlaceContext">
              <div class="contextPlaceContextImage">
                <img 
                  :src="PlacesListData[place.type].icon"
                  alt="icon"
                  class="fade-in"
                  @load="onImageLoad"
                />
              </div>
              <div class="contextPlaceContextTitle">
                <h4 v-if="$i18n.locale === 'en'">{{ toRoman(place.id) }} {{ PlacesListData[place.type].nameEn }}</h4>
                <h4 v-if="$i18n.locale === 'ru'">{{ toRoman(place.id) }} {{ PlacesListData[place.type].name }}</h4>
              </div>
              <div class="contextPlaceContextInfo">
                <IconComp 
                  :icon="Icon.Friends"
                  width="12px"
                  height="12px"
                />
                <p>{{ place.referrals_need }}</p>
                <span>+{{ place.percents_add }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="contextTip">
          <IconComp
            :icon="Icon.InfoWhite"
            width="18px"
            height="18px"
          />
          <p v-html="$t('Place.Tip')"></p>
        </div>

      </div>
    </div>
  </section>

<div class="button">
  <button @click="openHome">
    <IconComp 
      :icon="Icon.ChevroneLeft"
      width="24px"
      height="24px"
    />
    <span v-html="$t('Place.ButtonBack')"></span>
  </button>
</div>
</template>

<script lang="ts">
import { AppCache } from '@/stores/pinia';
import { toRoman } from '@/utils/useGame';
import { getPlacesData } from '@/utils/usePlaces';
import { Icon } from '@/components/Icons';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue';

export default {
  props: {
    success: {
      type: Boolean,
      required: true,
    }
  },

  components: {
    IconComp,
  },

  data() {
    const appCache = AppCache();

    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      UserProgressTotalLines: 25,
      UserProgressCurrentAnimatedReferrals: 0,
      UserProgress: {
        ReferralsCountCurrent: 0,
        ReferralsCountNeed: 1,
        NextPlaceId: 0,
        NextPlaceType: 'village',
      },

      PlacesListData: getPlacesData() as any,
      PlacesList: appCache.PlacesData as any,
      UserData: appCache.UserData as any,
      UserPlace: appCache.UserData.place as any,

      Icon,
      toRoman,

      TelegramModule,
    };
  },

  computed: {
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
    },

    SlavedPage(): boolean {
      return this.UserData.is_slaved;
    },
  },

  mounted() {
    TelegramModule.useBackButton(() => {
      this.$router.push('/');
    });

    this.waitForAssets();

    this.$nextTick(() => {
      this.userProgressInit();
      this.animateReferralsProgress();
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
        '/logotype.svg',
        '/home/background-symbols-slave.png',
        '/home/background-symbols-village-1.png',
        '/home/chains-small.png',
        '/home/village-shield-1.png',
        '/home/shield1.png',
        '/home/rabs.png',
        '/home/rabs-two.png',
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

    openHome() {
      this.TelegramModule.useMediumHaptic();
      this.$router.push('/');
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
    }
  },
};
</script>

<style scoped lang="scss">
@use './Place.scss' as *;
</style>