import { defineStore } from 'pinia';

export const AppCache = defineStore('App', {
  state: () => ({
    UserData: {} as any,
    PlacesData: {} as any,
    TasksData: {} as any,
    GameData: {} as any,
  }),
});