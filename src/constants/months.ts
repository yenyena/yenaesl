export const MONTHS = [
  { name: 'March' },
  { name: 'April' },
  { name: 'May' },
  { name: 'June' },
  { name: 'July' },
  { name: 'August' },
  { name: 'September' },
  { name: 'October' },
  { name: 'November' },
  { name: 'December' },
  { name: 'January' },
  { name: 'February' },
] as const;

export const MONTH_NAMES = MONTHS.map((m) => m.name);
