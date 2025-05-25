<template>
  <section 
    class="_wrap _wallet" 
    :class="{ show: !IsPageLoading }"
  >

    <Modal
      :isVisible="WalletDisconnectModal"
      @update:isVisible="WalletDisconnectModal = $event"
    >
      <div class="modalTitle">
        <IconComp
          :icon="Icon.WalletFull"
          width="22px"
          height="22px"
          pathColor="#fff"
        />
        <h4 v-html="$t('Modal.DisconnectWallet.Title')"></h4>
      </div>
      
      <div class="modalDescription">
        <p v-html="$t('Modal.DisconnectWallet.Description')"></p>
      </div>

      <div class="modalButton">
        <button @click="walletDisconnect()">
          <IconComp 
            :icon="Icon.Close"
            width="24px"
            height="24px"
          />
          <span v-html="$t('Modal.DisconnectWallet.Button')"></span>
        </button>
      </div>
    </Modal>

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
            :icon="Icon.WalletFull"
            width="27px"
            height="27px"
            pathColor="#fff"
          />
          <h4 v-html="$t('Wallet.Title')"></h4>
        </div>

        <div class="contextDescrption">
          <p v-html="$t('Wallet.Description')"></p>
        </div>

        <div class="contextCoin">
          <img 
            src="/wallet/coin.webp"
            alt="coin"
            class="fade-in"
            @load="onImageLoad"
          />
        </div>

        <div class="contextMap">
          <div class="contextMapLines">
            <div class="contextMapLinesLine primary">
              <div class="contextMapLinesLineCircle"></div>
              <div class="contextMapLinesLineBorder"></div>
            </div>
            <div class="contextMapLinesLine primary">
              <div class="contextMapLinesLineCircle"></div>
              <div class="contextMapLinesLineBorder"></div>
            </div>
            <div class="contextMapLinesLine">
              <div class="contextMapLinesLineCircle"></div>
            </div>
          </div>
          <div class="contextMapInfo">
            <div class="contextMapInfoItem">
              <h4 v-html="$t('Wallet.Title_Map1')"></h4>
              <p v-html="$t('Wallet.Description_Map1')"></p>
            </div>
            <div class="contextMapInfoItem">
              <h4 v-html="$t('Wallet.Title_Map2')"></h4>
              <p v-html="$t('Wallet.Description_Map2')"></p>
            </div>
            <div class="contextMapInfoItem">
              <h4 v-html="$t('Wallet.Title_Map3')"></h4>
              <p v-html="$t('Wallet.Description_Map3')"></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <div class="button" :class="{ connected: walletConnected }">
    <button v-if="!walletConnected" @click="openTonWallet()">
      <IconComp 
        :icon="Icon.Ton"
        width="24px"
        height="24px"
      />
      <span v-html="$t('Wallet.ConnectWallet')"></span>
    </button>
    <button v-if="walletConnected" @click="modalOpenWalletDisconnect()">
      <IconComp 
        :icon="Icon.Ton"
        width="24px"
        height="24px"
        pathColor="#fff"
      />
      <span v-html="$t('Wallet.Connected', { address: obfuscateAddress(walletAddress) })"></span>
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Icon } from '@/components/Icons';
import { tonConnectUI } from '@/hooks/useTonConnect';
import { obfuscateAddress } from '@/utils/useApp';
import { toUserFriendlyAddress } from 'ton-ui-vue';
import { AppCache } from '@/stores/pinia';

import * as walletApi from '@/api/services/wallet.service'

import TelegramModule from '@/hooks/useTelegram';
import IconComp from '@/components/IconComp.vue'
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal/Modal.vue'

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

  setup() {
    const walletConnected = ref(false);
    const walletAddress = ref('');

    const openTonWallet = () => {
      tonConnectUI.openModal();
      TelegramModule.useMediumHaptic();

      const interval = setInterval(() => {
        if (tonConnectUI.connected) {
          walletConnected.value = true;
          clearInterval(interval);
          
          const walletAddress = getTonWalletAddress() as string;
          walletApi.connect({ address: walletAddress });
        }
      }, 1000);
    }

    const checkTonWallet = () => {
      const isTonWallet = tonConnectUI.connected;
      walletConnected.value = isTonWallet;
    }

    const getTonWalletAddress = () => {
      if (!tonConnectUI.account) return;
      const rawAddress = tonConnectUI.account.address as any;
      const walletAddressString = toUserFriendlyAddress(rawAddress);
      walletAddress.value = walletAddressString;
      return walletAddressString;
    }

    const disconnectTonWallet = () => {
      walletConnected.value = false;
      tonConnectUI.disconnect();
      walletApi.disconnect();
    }

    getTonWalletAddress();
    checkTonWallet();
    
    return {
      tonConnectUI,
      openTonWallet,
      walletConnected,
      disconnectTonWallet,

      walletAddress,
    };
  },

  data() {
    const appCache = AppCache() as any;
    
    return {
      PropsSuccess: this.success,
      IsPageLoading: false,

      WalletDisconnectModal: false,

      UserData: appCache.UserData,

      Icon,

      obfuscateAddress,
    };
  },

  mounted() {
    TelegramModule.hideBackButton();
    
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
        '/wallet/coin.png',
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
      TelegramModule.useMediumHaptic();
    },

    modalOpenWalletDisconnect() {
      this.WalletDisconnectModal = true;
      TelegramModule.useMediumHaptic();
    },

    walletDisconnect() {
      this.disconnectTonWallet();
      this.WalletDisconnectModal = false;
      TelegramModule.useMediumHaptic();
    },
  },
};
</script>

<style scoped lang="scss">
@use './Wallet.scss' as *;
@use '@/components/Modal/Modal.scss' as *;
</style>