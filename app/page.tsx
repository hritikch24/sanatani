import HomeClient from './HomeClient';
import { getIndiaDate } from './lib/panchang';

export const revalidate = 300;

export default function HomePage() {
  const date = getIndiaDate();
  const shlokaIndex = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 86400000) % 21;
  const dateLabel = new Intl.DateTimeFormat('hi-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00+05:30`));
  return <HomeClient shlokaIndex={shlokaIndex} dateLabel={dateLabel} />;
}
