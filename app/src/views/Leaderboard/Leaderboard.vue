<template>
  <section 
    class="_wrap _leaderboard" 
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
          <h4>Leaders</h4>
        </div>

        <div class="contextDescrption">
          <p>Top 100 masters earn exclusive rewards. The more slaves you bring — the higher you rise.</p>
        </div>

        <div v-if="LeadersData && LeadersData.length > 0" class="contextLeaders">
          <div
            v-for="(leader, index) in LeadersData"
            :key="index"
            class="contextLeadersLeader"
            :ref="(el) => index === LeadersData.length - 1 ? setLastLeaderRef(el) : null"
          >
            <div class="contextLeadersLeaderNumber">
              <h1 v-if="leader.id < 10" class="big" :class="{ first: leader.id === 1, two: leader.id === 2, three: leader.id === 3 }">#{{ leader.id }}</h1>
              <h1 v-if="leader.id >= 10 && leader.id < 100" class="medium">#{{ leader.id }}</h1>
              <h1 v-if="leader.id >= 100 && leader.id < 1000" class="small">#{{ leader.id }}</h1>
            </div>
            <div class="contextLeadersLeaderImage">
              <img
                v-if="leader.photo_url"
                :src="leader.photo_url"
                alt="avatar"
                class="fade-in"
                @load="onImageLoad"
              >

              <div v-if="!leader.photo_url" class="avatar-null">
                <h1>{{ leader.first_name[0] }}</h1>
              </div>

              <img 
                v-if="PlacesListData[leader.place]"
                class="league fade-in" 
                :src="PlacesListData[leader.place].icon" 
                alt="league"
                @load="onImageLoad"
              >
            </div>
            <div class="contextLeadersLeaderContext">
              <div class="contextLeadersLeaderContextTitle">
                <h4>{{ leader.first_name }} {{ leader.last_name }}</h4>
              </div>
              <div class="contextLeadersLeaderContextDescription">
                <span>{{ toUniqNumber(leader.referrals_reward) }}</span>
                <IconComp
                  :icon="Icon.Token"
                  width="10px"
                  height="10px"
                  pathColor="#AAAAAA"
                />
              </div>
            </div>
            <div class="contextLeadersLeaderValue">
              <span>{{ leader.referrals_count }}</span>
              <IconComp
                :icon="Icon.Friends"
                width="16px"
                height="16px"
              />
            </div>
          </div>
        </div>

        <div v-if="!LeadersData || LeadersData.length === 0" class="contextLeaders loading">
          <div class="loader-button"></div>
        </div>

      </div>
      
      <div class="contextPinnedLeader">
        <!-- <div class="contextPinnedLeaderNumber">
          <h1>#100</h1>
        </div> -->
        <div class="contextPinnedLeaderImage">
          <img 
            :src="UserData.photo_link"
            alt="avatar"
            class="fade-in"
            @load="onImageLoad"
          >
          <img 
            class="league fade-in" 
            :src="PlacesListData[UserData.place.place_type].icon"
            alt="league"
            @load="onImageLoad"
          >
        </div>
        <div class="contextPinnedLeaderContext">
          <div class="contextPinnedLeaderContextTitle">
            <h4>ТЫ</h4>
          </div>
          <div class="contextPinnedLeaderContextDescription">
            <span>{{ toUniqNumber(UserData.tokens_per_hour) }}</span>
            <IconComp
              :icon="Icon.Token"
              width="10px"
              height="10px"
              pathColor="#AAAAAA"
            />
          </div>
        </div>
        <div class="contextPinnedLeaderValue">
          <span>{{ UserData.referrals_count }}</span>
          <IconComp
            :icon="Icon.Friends"
            width="16px"
            height="16px"
          />
        </div>
      </div>

    </div>

  </section>
</template>

<script lang="ts">
import { Icon } from '@/components/Icons';
import { AppCache } from '@/stores/pinia';
import { getPlacesData } from '@/utils/usePlaces';
import { toUniqNumber } from '@/utils/useGame';

import * as leadersApi from '@/api/services/leaders.service';

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue';
import Loader from '@/components/Loader.vue';

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

      PlacesListData: getPlacesData() as any,

      LeadersData: [] as any[],
      LeadersOffset: 0,
      LeadersLimit: 10,
      LeadersObserver: null as IntersectionObserver | null,
      LastLeader: null as HTMLElement | null,

      UserData: appCache.UserData,

      Icon,

      toUniqNumber,
    };
  },

  mounted() {
    TelegramModule.hideBackButton();

    this.fetchLeaders();
  },

  watch: {
    LastLeader(newEl) {
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

    openHome() {
      this.$router.push('/');
    },

    async fetchLeaders() {
      const leaders = await leadersApi.get({
        offset: this.LeadersOffset,
        limit: this.LeadersLimit
      });

      if (leaders.length) {
        this.LeadersData.push(...leaders);
        this.LeadersOffset += this.LeadersLimit;
      } else {
        this.LeadersObserver?.disconnect();
      }
    },

    setLastLeaderRef(el: HTMLElement | any) {
      this.LastLeader = el;
    },

    initObserver() {
      this.LeadersObserver?.disconnect();
      if (!this.LastLeader) return;

      this.LeadersObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) this.fetchLeaders();
      }, { root: null, rootMargin: '0px', threshold: 1.0 });

      this.LeadersObserver.observe(this.LastLeader);
    }
  },
};
</script>

<style scoped lang="scss">
@use './Leaderboard.scss' as *;
</style>