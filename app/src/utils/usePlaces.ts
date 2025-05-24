const placesData = {
  chains: {
    id: 0,
    name: 'Цепи',
    icon: '/places/icons/village.webp',
    photo: '/places/village.webp',
  },
  village: {
    id: 1,
    name: 'Деревня',
    icon: '/places/icons/village.webp',
    photo: '/places/village.webp',
  },
  city: {
    id: 2,
    name: 'Город',
    icon: '/places/icons/city.webp',
    photo: '/places/city.webp',
  },
  megapolis: {
    id: 3,
    name: 'Мегаполис',
    icon: '/places/icons/megapolis.webp',
    photo: '/places/megapolis.webp',
  },
  kingdom: {
    id: 4,
    name: 'Королевство',
    icon: '/places/icons/kingdom.webp',
    photo: '/places/kingdom.webp',
  },
  empire: {
    id: 5,
    name: 'Империя',
    icon: '/places/icons/empire.webp',
    photo: '/places/empire.webp',
  },
  pantheon: {
    id: 6,
    name: 'Пантеон',
    icon: '/places/icons/pantheon.webp',
    photo: '/places/pantheon.webp',
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