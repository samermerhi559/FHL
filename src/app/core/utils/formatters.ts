const percentFormatter = (value: number) =>
  Number(value.toFixed(Math.abs(value) < 1 ? 2 : 1));

export const formatCurrencyCompact = (
  value?: number | null,
  currency = 'USD'
): string => {
  if (value === null || value === undefined) {
    return '--';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDays = (value?: number | null): string => {
  if (value === null || value === undefined) {
    return '--';
  }
  return `${Math.round(value)} days`;
};

export const toDeltaPercent = (
  value?: number | null
): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  return percentFormatter(Math.abs(value * 100));
};
