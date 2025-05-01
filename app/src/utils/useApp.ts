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
