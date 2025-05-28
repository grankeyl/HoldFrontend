import { init, on, postEvent, shareStory } from '@telegram-apps/sdk';
import { invoice } from '@telegram-apps/sdk';
import { isDesktop } from '@/utils/checkDevice';

import WebApp from "@twa-dev/sdk";


init()


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
        return WebApp.initDataUnsafe?.start_param || null;
    },

    hideBackButton() {
        const backButton = WebApp.BackButton;
        if (backButton?.isVisible !== undefined) {
            backButton.hide();
        }
    },

    useBackButton(action: () => void) {
        const backButton = WebApp.BackButton;
        if (backButton?.show && backButton.onClick) {
            backButton.show();
            backButton.onClick(action);
        }
    },

    useSoftHaptic() {
        if (WebApp.HapticFeedback?.impactOccurred) {
            WebApp.HapticFeedback.impactOccurred('soft');
        }
    },

    useLightHaptic() {
        if (WebApp.HapticFeedback?.impactOccurred) {
            WebApp.HapticFeedback.impactOccurred('light');
        }
    },

    useMediumHaptic() {
        if (WebApp.HapticFeedback?.impactOccurred) {
            WebApp.HapticFeedback.impactOccurred('medium');
        }
    },

    useHeavyHaptic() {
        if (WebApp.HapticFeedback?.impactOccurred) {
            WebApp.HapticFeedback.impactOccurred('heavy');
        }
    },

    useLink(link: string) {
        WebApp.openTelegramLink(link);
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
      const encodedUrl = encodeURIComponent(url);
      const encodedMessage = encodeURIComponent(message);
      const shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
      WebApp.openTelegramLink(shareLink);
    }
};

export default TelegramModule;