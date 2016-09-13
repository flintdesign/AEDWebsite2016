const numberWithCommas = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const formatNumber = num => {
  if (num === 0) return '0';
  if (!num) return '-';
  return numberWithCommas(parseInt(num, 10));
};
export const formatFloat = num => parseFloat(num, 10).toFixed(1);
