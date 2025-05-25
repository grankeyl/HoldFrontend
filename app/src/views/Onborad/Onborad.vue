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
            <h4 v-html="$t('Onborad.Title_Step4', { name: UserData.refer_name })"></h4>
          </div>
          <div class="contextDescription">
            <p v-html="$t('Onborad.Description_Step4')"></p>
          </div>
        </div>

        <div class="button">
          <button @click="setPageToHome()">
            <span v-html="$t('Onborad.Button_Step4')"></span>
          </button>
        </div>
      </div>

    </div>
  </section>

  <section 
    v-if="IsSlavePage"
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
            <h4 v-html="$t('Onborad.Title_Step1')"></h4>
          </div>
          <div class="contextDescription">
            <p v-html="$t('Onborad.Description_Step1')"></p>
          </div>
        </div>

        <div class="button">
          <button @click="setOnboradStep(1)">
            <span v-html="$t('Onborad.Button_Step1')"></span>
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
            <h4 v-html="$t('Onborad.Title_Step2')"></h4>
          </div>
          <div class="contextDescription">
            <p v-html="$t('Onborad.Description_Step2')"></p>
          </div>
        </div>

        <div class="button">
          <button @click="setOnboradStep(2)">
            <span v-html="$t('Onborad.Button_Step2')"></span>
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
            <h4 v-html="$t('Onborad.Title_Step3')"></h4>
          </div>
          <div class="contextDescription">
            <p v-html="$t('Onborad.Description_Step3')"></p>
          </div>
        </div>

        <div class="button">
          <button @click="setPageToHome()">
            <span v-html="$t('Onborad.Button_Step3')"></span>
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

    const TypePage = Route.params.type as string | 'registration';
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
      if (this.IsSlavePage === 'registration' && this.OnboradStep >= 2) {
        this.$router.push('/');
        return;
      }

      if (this.IsSlavePage === 'slaved') {
        if (this.OnboradStep >= 3) {
          this.$router.push('/');
        } else {
          this.OnboradStep++;
        }
        return;
      }

      if (this.OnboradStep >= 3) {
        this.$router.push('/');
        return;
      }

      this.$router.push('/');
    }
  },
};
</script>

<style scoped lang="scss">
@use './Onborad.scss' as *;
</style>