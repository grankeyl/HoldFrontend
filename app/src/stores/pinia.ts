import { defineStore } from 'pinia';

export const AppCache = defineStore('App', {
  state: () => ({
    UserData: {} as any,
    PlacesData: {} as any,
    GameData: {} as any,

    TasksData: {
      Banners: [] as any[],
      Referrals: [] as any[],
      Tasks: [] as any[],
    },
  }),
});