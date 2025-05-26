import { hapticFeedback, miniApp, on, postEvent, mockTelegramEnv, shareStory } from '@telegram-apps/sdk';
import { backButton, invoice, initDataStartParam, openTelegramLink } from '@telegram-apps/sdk';
import { init, retrieveLaunchParams } from '@telegram-apps/sdk';
import { isDesktop } from '@/utils/checkDevice';
import WebApp from "@twa-dev/sdk";

function mock(status: string = import.meta.env.VITE_APP_TEST) {
    if (status === 'development') {
      mockTelegramEnv({
        themeParams: {
          accentTextColor: '#2ea6ff',
          bgColor: '#000000',
          buttonColor: '#2ea6ff',
          buttonTextColor: '#ffffff',
          destructiveTextColor: '#ef5b5b',
          headerBgColor: '#000000',
          hintColor: '#b1c3d5',
          linkColor: '#62bcf9',
          secondaryBgColor: '#131415',
          sectionBgColor: '#18222d',
          sectionHeaderTextColor: '#b1c3d5',
          subtitleTextColor: '#b1c3d5',
          textColor: '#ffffff',
        },
        initData: {
          user: {
            id: 2200247226,
            firstName: 'wwt',
            lastName: '',
            languageCode: 'ru',
            isPremium: true,
            allowsWriteToPm: true,
            photoUrl: 'https://a-ttgme.stel.com/i/userpic/320/OERv8lzDgDAie_Vug0fWgGKrGbilJE23xIyDJ0x0FcNpibvL9mFLSOkM7Dszycw_.svg',
          },
          hash: '488b3c2ebb52f3d29f9f6478c97c8fbf75c49a06425ac6371f172c358be703d0',
          authDate: new Date(1738006494000),
          signature: 'G327NYDx2mn6BzMyWirsvYUUMSPR9DAJUAacYo7AK56irlFGX21LTSttRIb7kAWlieCfhDLFybwEUis-hhZyDQ',
          chatType: 'sender',
          chatInstance: '8428209589180549439',
        },
        initDataRaw: new URLSearchParams([
          ['user', JSON.stringify({
            id: 2200247226,
            first_name: 'wwt',
            last_name: '',
            language_code: 'ru',
            is_premium: true,
            allows_write_to_pm: true,
          })],
          ['hash', '488b3c2ebb52f3d29f9f6478c97c8fbf75c49a06425ac6371f172c358be703d0'],
          ['auth_date', '1738006494'],
          ['signature', 'G327NYDx2mn6BzMyWirsvYUUMSPR9DAJUAacYo7AK56irlFGX21LTSttRIb7kAWlieCfhDLFybwEUis-hhZyDQ'],
          ['chat_type', 'sender'],
          ['chat_instance', '8428209589180549439'],
        ]).toString(),
        version: '8.0',
        platform: 'tdesktop',
      });
    }
  }

mock();
init();

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

    readyMiniApp() {
      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }
    },

    initDataRaw() {
        this.initMiniApp();

        const { initDataRaw } = retrieveLaunchParams()
        return initDataRaw;
    },

    initData() {
        this.initMiniApp();

        const { initData } = retrieveLaunchParams()
        return initData;
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