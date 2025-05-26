import { hapticFeedback, on, postEvent, shareStory } from '@telegram-apps/sdk';
import { backButton, invoice, initDataStartParam, openTelegramLink } from '@telegram-apps/sdk';
import { isDesktop } from '@/utils/checkDevice';

import WebApp from "@twa-dev/sdk";


const TelegramModule = {
    async initMiniApp() { 
      WebApp.requestWriteAccess();
      WebApp.disableVerticalSwipes();
      WebApp.expand();

      if (!isDesktop()) {
        WebApp.requestFullscreen();
      }
      WebApp.ready();
    },

    initDataRaw() {
        return WebApp.initData;
    },

    initData() {
        return WebApp.initDataUnsafe;
    },

    checkStartParam() {
        const startParam = initDataStartParam();
        return startParam;
    },

    hideBackButton() {
        if (backButton.isSupported()) {
            backButton.mount();
            backButton.hide();
        }
    },

    useBackButton(action: any) {
        if (backButton.isSupported()) {
            backButton.mount();
            backButton.show();
            backButton.onClick(action);
        }
    },

    useSoftHaptic() {
        if (hapticFeedback.impactOccurred.isAvailable()) {
            hapticFeedback.impactOccurred('soft');
        }
    },

    useLightHaptic() {
        if (hapticFeedback.impactOccurred.isAvailable()) {
            hapticFeedback.impactOccurred('light');
        }
    },

    useMediumHaptic() {
        if (hapticFeedback.impactOccurred.isAvailable()) {
            hapticFeedback.impactOccurred('medium');
        }
    },

    useHeavyHaptic() {
        if (hapticFeedback.impactOccurred.isAvailable()) {
            hapticFeedback.impactOccurred('heavy');
        }
    },

    useLink(link: string) {
        if (openTelegramLink.isAvailable()) {
            openTelegramLink(link);
        }
    },

    async useShareMessage(id: string) {
        const cleanup: VoidFunction[] = [];
        return new Promise((res, rej) => {
            cleanup.push(
                on('prepared_message_failed' as any, rej),
                on('prepared_message_sent' as any, res),
            );
            postEvent('web_app_send_prepared_message' as any, { id });
            })
            .finally(() => {
                cleanup.forEach(c => c())
            });
    },

    async useInvoice(invoiceUrl: string, actionSuccess: any, actionError: any) {
        if (!invoice.isSupported()) actionError();

        const promise = invoice.open(invoiceUrl, 'url');
        const status = await promise;

        if (status === 'paid') {
            actionSuccess();
        } else {
            actionError();
        }
    },

    async useShareStory(storyMedia: string, language: string, referralLink: string) {
      if (!shareStory.isSupported()) return;
      if (!shareStory.isAvailable()) return;

      if (language === 'ru') {
        shareStory(storyMedia, {
          text: `${referralLink} Зарабатывайте, ничего не делая. Пусть рабы работают на вас в холде.`,
          widgetLink: {
            url: referralLink,
            name: import.meta.env.VITE_APP_MINI_APP_USERNAME,
          },
        });
      } else {
        shareStory(storyMedia, {
          text: `${referralLink} Earn by doing nothing. Let the slaves work for you in Hold.`,
          widgetLink: {
            url: referralLink,
            name: import.meta.env.VITE_APP_MINI_APP_USERNAME,
          },
        });
      }

      return true;
    },

    async useSendMessage(url: string, message: string) {
      const link = `https://t.me/share?url=${url}&text=${message}`
      this.useLink(link);
    }
};

export default TelegramModule;