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
            :style="{ animationDelay: `${index * 0.035}s` }"
            :ref="(el) => index === LeadersData.length - 1 ? setLastLeaderRef(el) : null"
          >
            <div class="contextLeadersLeaderNumber">
              <h1>#{{ leader.id }}</h1>
            </div>
            <div class="contextLeadersLeaderImage">
              <img 
                :src="leader.photo_url"
                alt="avatar"
                class="fade-in"
                @load="onImageLoad"
              >
              <img 
                class="league fade-in" 
                :src="PlacesListData[leader.place.place_type].icon" 
                alt="league"
                @load="onImageLoad"
              >
            </div>
            <div class="contextLeadersLeaderContext">
              <div class="contextLeadersLeaderContextTitle">
                <h4>{{ leader.first_name }} {{ leader.last_name }}</h4>
              </div>
              <div class="contextLeadersLeaderContextDescription">
                <span>{{ leader.referrals_reward }}</span>
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
        <div class="contextPinnedLeaderNumber">
          <h1>#1</h1>
        </div>
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
            <span>{{ UserData.tokens_per_hour }}</span>
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

      LeadersData: [] as any[],
      LeadersOffset: 0,
      LeadersLimit: 10,

      PlacesListData: getPlacesData() as any,

      LeadersObserver: null as IntersectionObserver | null,
      LastLeader: null as HTMLElement | null,

      UserData: appCache.UserData,

      Icon,
    };
  },

  mounted() {
    TelegramModule.hideBackButton();
    
    // this.waitForAssets();

    this.leadersDataGet();
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

    async leadersDataGet() {
      const leaders = await leadersApi.get({ 
        offset: this.LeadersOffset, 
        limit: this.LeadersLimit
      });

      this.LeadersData.push(...leaders);
    },

    async loadMoreLeaders() {
      this.LeadersOffset += this.LeadersLimit;
      const moreLeaders = await leadersApi.get({
        offset: this.LeadersOffset,
        limit: this.LeadersLimit
      });

      if (moreLeaders.length > 0) {
        this.LeadersData.push(...moreLeaders);
      } else if (this.LeadersObserver) {
        this.LeadersObserver.disconnect();
      }
    },

    setLastLeaderRef(el: HTMLElement | any) {
      this.LastLeader = el;
    },

    initObserver() {
      if (this.LeadersObserver) this.LeadersObserver.disconnect();

      const lastEl = this.LastLeader;
      if (!lastEl) return;

      this.LeadersObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMoreLeaders();
        }
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      });

      this.LeadersObserver.observe(lastEl);
    }
  },
};
</script>

<style scoped lang="scss">
@use './Leaderboard.scss' as *;
</style>