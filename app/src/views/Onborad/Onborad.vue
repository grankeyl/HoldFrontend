<template>
  <div class="head">
    <img src="/logotype.svg" alt="logotype" />
  </div>

  <section 
    v-if="OnboradStep === 3" 
    class="_wrap _onborad _slaved" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_onboradSymbols no-animation">
      <img 
        src="/onborad/background-symbols-slave.png"
        alt="background-symbols-slave"
        class="fade-in"
        @load="onImageLoad"
      />
    </div>

    <div class="_view">
      <div class="contextSection">
        <div class="context">
          <div class="contextImage">
            <img 
              src="/onborad/chains.png"
              alt="chains"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <div class="contextTitle">
            <h4>You’ve Been Enslaved by <span>{{ UserData.refer_name }}</span>!</h4>
          </div>
          <div class="contextDescription">
            <p>
              Watch ads 
              <span>or buy your freedom by inviting new slaves to start earning</span>
              real money 
              <span>and building your</span>
              own empire<span>!</span>
            </p>
          </div>
        </div>

        <div class="button">
          <button @click="setPageToHome()">
            <span>Lets Go!</span>
          </button>
        </div>
      </div>

    </div>
  </section>

  <section 
    v-if="IsSlavePage === 'registered'"
    class="_wrap _onborad" 
    :class="{ show: !IsPageLoading }"
  >
    <div class="_onboradSymbols">
      <img 
        src="/onborad/background-symbols.png" 
        alt="background-symbols"
        class="fade-in"
        @load="onImageLoad"
       />
    </div>

    <div class="_view">
      <div v-if="OnboradStep === 0" class="contextSection">
        <div class="context">
          <div class="contextImage">
            <img
              src="/onborad/flag.png"
              alt="flag"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <div class="contextTitle">
            <h4>It’s Time<br>to Build <span>Empire</span>!</h4>
          </div>
          <div class="contextDescription">
            <p>Enslave your friends<span>, collect rewards, expand your influence and earn</span> real money</p>
          </div>
        </div>

        <div class="button">
          <button @click="setOnboradStep(1)">
            <span>OMG</span>
          </button>
        </div>
      </div>

      <div v-if="OnboradStep === 1" class="contextSection">
        <div class="context">
          <div class="contextImage">
            <img 
              src="/onborad/coin.png"
              alt="coin"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <div class="contextTitle">
            <h4>Real Profits,<br><span>No Scams.</span></h4>
          </div>
          <div class="contextDescription">
            <p>We earn<span> from ads and </span>share with you.<span> The bigger you grow, the more you make. Save tokens for the </span>Airdrop<span>!</span></p>
          </div>
        </div>

        <div class="button">
          <button @click="setOnboradStep(2)">
            <span>Wow!</span>
          </button>
        </div>
      </div>

      <div v-if="OnboradStep === 2" class="contextSection">
        <div class="context">
          <div class="contextImage">
            <img 
              src="/onborad/chest.png"
              alt="chest"
              class="fade-in"
              @load="onImageLoad"
            />
          </div>
          <div class="contextTitle">
            <h4>Simple Rules,<br><span>Big Rewards</span></h4>
          </div>
          <div class="contextDescription">
            <p><span>Earn tokens by</span> watching ads<span>, strengthen your empire with new recruits, and </span>boost <span>your income by </span>upgrading<span> them.</span></p>
          </div>
        </div>

        <div class="button">
          <button @click="setPageToHome()">
            <span>Lets Go!</span>
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { AppCache } from '@/stores/pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const appCache = AppCache() as any;

export default {
  props: {
    success: {
      type: Boolean,
      required: true,
    }
  },

  setup() {
    const Route = useRoute();

    const TypePage = Route.params.type as string;
    const IsSlavePage = ref(TypePage || 'registration');

    return {
      IsSlavePage
    };
  },

  data() {
    return {
      PropsSuccess: this.success,
      IsPageLoading: false,
      OnboradStep: 0,

      UserData: appCache.UserData,
    };
  },

  mounted() {
    this.waitForAssets();
  },

  methods: {
    onImageLoad(event: Event) {
      const img = event.target as HTMLImageElement;
      img.classList.add('loaded');
    },

    async waitForAssets() {
      const fontPromise = document.fonts?.ready ?? Promise.resolve();
      const imagePromises = [
        '/onborad/background-symbols-slave.png',
        '/onborad/background-symbols.png',
        '/onborad/flag.png',
        '/onborad/coin.png',
        '/onborad/chest.png',
        '/onborad/chains.png',
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

    setOnboradStep(step: number) {
      this.OnboradStep = step;
    },

    setPageToHome() {
      if (this.OnboradStep >= 3) { return this.$router.push('/'); }
      if (this.IsSlavePage === 'slaved') { this.OnboradStep++; return; }
      this.$router.push('/');
    },
  },
};
</script>

<style scoped lang="scss">
@use './Onborad.scss' as *;
</style>