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
        <h4>Disconnect wallet</h4>
      </div>
      
      <div class="modalDescription">
        <p>By disconnecting your wallet, you will lose the ability to receive rewards earned by your slaves and activities</p>
      </div>

      <div class="modalButton">
        <button @click="walletDisconnect()">
          <IconComp 
            :icon="Icon.Close"
            width="24px"
            height="24px"
          />
          <span>Отключить кошелек</span>
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
          <h4>Withdraw</h4>
        </div>

        <div class="contextDescrption">
          <p>Watch ads, invite friends, and collect tokens. Connect your wallet and join the Airdrop. The more you grow, the more you earn.</p>
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
              <h4>Build the hype</h4>
              <p>Invite friends & grow your kingdom</p>
            </div>
            <div class="contextMapInfoItem">
              <h4>Earn from activity</h4>
              <p>Watch ads, complete tasks, earn tokens from your slaves</p>
            </div>
            <div class="contextMapInfoItem">
              <h4>Withdraw real money</h4>
              <p>Convert tokens & cash out</p>
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
      <span>Подключить кошелек</span>
    </button>
    <button v-if="walletConnected" @click="modalOpenWalletDisconnect()">
      <IconComp 
        :icon="Icon.Ton"
        width="24px"
        height="24px"
        pathColor="#fff"
      />
      <span>Connected: {{ obfuscateAddress(walletAddress) }}</span>
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