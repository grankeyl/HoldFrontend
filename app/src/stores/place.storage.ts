import { defineStore } from 'pinia';

interface Place {
    placeId: string;
    placeType: string;
}

export const usePlaceStore = defineStore('place', {
    state: () => ({
        currentPlace: {
            placeId: '',
            placeType: '',
        } as Place,
    }),
    actions: {
        setCurrentPlace(place: Place) {
            this.currentPlace = place;
        },
    },
    persist: true
});