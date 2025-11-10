import { Period, WidgetCompareMode, WidgetMode } from '../types';

interface WidgetWindow {
  mode: WidgetMode;
  compare: WidgetCompareMode;
  from?: string;
  to?: string;
}

const pad = (value: number) => value.toString().padStart(2, '0');

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const resolveWidgetWindow = (
  period: Period,
  referenceDate = new Date()
): WidgetWindow => {
  switch (period.type) {
    case 'month':
      return {
        mode: 'month',
        compare: 'prev_period',
      };
    case 'quarter': {
      const quarterStartMonth = Math.floor(referenceDate.getMonth() / 3) * 3;
      const start = new Date(referenceDate.getFullYear(), quarterStartMonth, 1);
      const end = new Date(
        referenceDate.getFullYear(),
        quarterStartMonth + 3,
        0
      );
      return {
        mode: 'custom',
        from: formatDate(start),
        to: formatDate(end),
        compare: 'prev_period',
      };
    }
    case 'year':
      return {
        mode: 'year',
        compare: 'yoy',
      };
    case 'rolling':
    default: {
      const end = new Date(referenceDate);
      const start = new Date(end);
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(start.getDate() + 1);
      return {
        mode: 'custom',
        from: formatDate(start),
        to: formatDate(end),
        compare: 'prev_period',
      };
    }
  }
};
