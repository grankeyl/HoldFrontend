const placesData = {
  village: {
    name: 'Деревня',
    icon: '/places/icons/village.png',
    photo: '/places/village.png',
  },
  city: {
    name: 'Город',
    icon: '/places/icons/city.png',
    photo: '/places/city.png',
  },
  megapolis: {
    name: 'Мегаполис',
    icon: '/places/icons/megapolis.png',
    photo: '/places/megapolis.png',
  },
  kingdom: {
    name: 'Королевство',
    icon: '/places/icons/kingdom.png',
    photo: '/places/kingdom.png',
  },
  empire: {
    name: 'Империя',
    icon: '/places/icons/empire.png',
    photo: '/places/empire.png',
  },
  pantheon: {
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