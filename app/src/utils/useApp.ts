export const obfuscateAddress = (address: string) => {
    const startLength = 3;
    const endLength = 5;
    const str = address.slice(0, startLength) + "..." + address.slice(-endLength);
    if (str.length <= startLength + endLength) return str;
    return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
};

export const getReferralLink = (referralCode: string) => {
    return import.meta.env.VITE_APP_MINI_APP + '/?startapp=' + referralCode;
}

export const copyToClipboard = (text: string) => {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  
  const selection = document.getSelection();
  if (!selection) return;

  const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  el.select();

  document.execCommand("copy");
  document.body.removeChild(el);

  if (selected) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }
};

export const pluralize = (count: number, forms: string): string => {
  const jsonCompatible = forms.replace(/'/g, '"');
  const array = JSON.parse(jsonCompatible)
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return array[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return array[1];
  return array[2];
};

export const getCurrentLanguage = (lang: string) => {
  if (localStorage.getItem('language')) {
    console.log(localStorage.getItem('language'));
    return localStorage.getItem('language') as string;
  }

  if (lang === 'en') {
    return 'en';
  }

  if (lang === 'ru') {
    return 'ru';
  }

  return 'en';
}