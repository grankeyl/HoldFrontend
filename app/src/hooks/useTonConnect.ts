import { TonConnectUI, THEME } from '@tonconnect/ui';

export const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://holdslaves.com/tonconnect-manifest.json',
});

tonConnectUI.uiOptions = {
  language: 'en',
  uiPreferences: {
    theme: THEME.DARK,
  },
};