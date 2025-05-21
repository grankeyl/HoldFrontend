export function toRoman(num: number) {
  const romanMap = [
    { val: 1000, sym: "M" },
    { val: 900, sym: "CM" },
    { val: 500, sym: "D" },
    { val: 400, sym: "CD" },
    { val: 100, sym: "C" },
    { val: 90, sym: "XC" },
    { val: 50, sym: "L" },
    { val: 40, sym: "XL" },
    { val: 10, sym: "X" },
    { val: 9, sym: "IX" },
    { val: 5, sym: "V" },
    { val: 4, sym: "IV" },
    { val: 1, sym: "I" }
  ];

  let result = '';
  for (const { val, sym } of romanMap) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result;
}

export function toUniqNumber(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(2).replace(/\.0$/, '') + 'k';
  return n.toString();
}