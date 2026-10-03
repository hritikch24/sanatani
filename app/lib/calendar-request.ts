import { CITIES, getIndiaDate, isValidDate } from './panchang';

export type CalendarSearch = { [key: string]: string | string[] | undefined };

export function calendarSelection(params: CalendarSearch, mode: 'day' | 'month') {
  const today = getIndiaDate();
  const requestedDate = typeof params.date === 'string' ? params.date : '';
  const requestedMonth = typeof params.month === 'string' ? params.month : '';
  const city = CITIES.find(item => item.id === params.city)?.id ?? 'new-delhi';
  let date = isValidDate(requestedDate) ? requestedDate : today;
  if (mode === 'month' && /^\d{4}-\d{2}$/.test(requestedMonth) && isValidDate(`${requestedMonth}-01`) && !date.startsWith(requestedMonth)) date = `${requestedMonth}-01`;
  return { date, city, customized: Boolean(params.date || params.month || params.city) };
}
