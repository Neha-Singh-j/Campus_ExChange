/** "₹1,250" - uses Indian digit grouping. */
export const formatMoney = (amount, currency = '₹') => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency}0`;
  return `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export const timeAgo = (iso) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
