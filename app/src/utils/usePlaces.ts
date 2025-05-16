const placesData = {
  chains: {
    id: 0,
    name: 'Цепи',
    icon: '/places/icons/village.png',
    photo: '/places/village.png',
  },
  village: {
    id: 1,
    name: 'Деревня',
    icon: '/places/icons/village.png',
    photo: '/places/village.png',
  },
  city: {
    id: 2,
    name: 'Город',
    icon: '/places/icons/city.png',
    photo: '/places/city.png',
  },
  megapolis: {
    id: 3,
    name: 'Мегаполис',
    icon: '/places/icons/megapolis.png',
    photo: '/places/megapolis.png',
  },
  kingdom: {
    id: 4,
    name: 'Королевство',
    icon: '/places/icons/kingdom.png',
    photo: '/places/kingdom.png',
  },
  empire: {
    id: 5,
    name: 'Империя',
    icon: '/places/icons/empire.png',
    photo: '/places/empire.png',
  },
  pantheon: {
    id: 6,
    name: 'Пантеон',
    icon: '/places/icons/pantheon.png',
    photo: '/places/pantheon.png',
  },
} as const;


export const getPlacesData = () => {
  return placesData || {};
}

// export const getPlacePhoto = (place_type: PlaceType | undefined) => {
//   if (!place_type) return '';
//   return placesData[place_type].photo;
// }

// export const getPlaceName = (place_type: PlaceType | undefined) => {
//     if (!place_type) return '';
//     return placesData[place_type].name;
// }