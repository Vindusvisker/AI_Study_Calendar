import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  isWithinInterval
} from 'date-fns';
import { TimeFilterValue } from '../components/planner/TimeFilter';

export const getDateRange = (filter: TimeFilterValue) => {
  const now = new Date();

  switch (filter) {
    case 'all':
      return {
        start: new Date(0), // Beginning of time
        end: new Date(8640000000000000) // End of time (max date)
      };
    case 'day':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 })
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    case 'nextMonth':
      const nextMonth = addMonths(now, 1);
      return {
        start: startOfMonth(nextMonth),
        end: endOfMonth(nextMonth)
      };
    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
  }
};

export const isDateInRange = (date: Date | string, filter: TimeFilterValue): boolean => {
  if (filter === 'all') return true;
  
  const dateToCheck = typeof date === 'string' ? new Date(date) : date;
  const { start, end } = getDateRange(filter);

  return isWithinInterval(dateToCheck, { start, end });
};