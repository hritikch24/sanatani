import { Body, Illumination, MoonPhase, Observer, SearchMoonPhase, SearchRiseSet } from 'astronomy-engine';

export const CITIES = [
  { id: 'new-delhi', name: 'नई दिल्ली', latitude: 28.6139, longitude: 77.209 },
  { id: 'mumbai', name: 'मुंबई', latitude: 19.076, longitude: 72.8777 },
  { id: 'varanasi', name: 'वाराणसी', latitude: 25.3176, longitude: 82.9739 },
  { id: 'ayodhya', name: 'अयोध्या', latitude: 26.7922, longitude: 82.1998 },
  { id: 'ujjain', name: 'उज्जैन', latitude: 23.1765, longitude: 75.7885 },
  { id: 'jaipur', name: 'जयपुर', latitude: 26.9124, longitude: 75.7873 },
  { id: 'ahmedabad', name: 'अहमदाबाद', latitude: 23.0225, longitude: 72.5714 },
  { id: 'kolkata', name: 'कोलकाता', latitude: 22.5726, longitude: 88.3639 },
  { id: 'bengaluru', name: 'बेंगलुरु', latitude: 12.9716, longitude: 77.5946 },
  { id: 'chennai', name: 'चेन्नई', latitude: 13.0827, longitude: 80.2707 },
  { id: 'hyderabad', name: 'हैदराबाद', latitude: 17.385, longitude: 78.4867 },
  { id: 'haridwar', name: 'हरिद्वार', latitude: 29.9457, longitude: 78.1642 },
] as const;

export type PanchangDay = {
  date: string;
  city: (typeof CITIES)[number];
  sunrise: string | null;
  sunset: string | null;
  sampledAt: string;
  weekday: string;
  tithi: { number: number; name: string; paksha: string; end: string };
  illumination: number;
  moonPhase: string;
  observances: string[];
};

const TITHIS = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी'];
const dayCache = new Map<string, PanchangDay>();

export function isValidDate(value: string): boolean {
  if (!/^20(?:2\d|3\d|40)-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function getIndiaDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (name: string) => parts.find(item => item.type === name)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function formatHindiDate(date: string): string {
  return new Intl.DateTimeFormat('hi-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00+05:30`));
}

export function formatIndiaTime(value: string | null): string {
  if (!value) return 'उपलब्ध नहीं';
  return new Intl.DateTimeFormat('hi-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

export function getPanchang(date: string, cityId = 'new-delhi'): PanchangDay {
  if (!isValidDate(date)) throw new RangeError('Choose a valid date between 2020 and 2040.');
  const city = CITIES.find(item => item.id === cityId);
  if (!city) throw new RangeError('Choose a supported city.');
  const cacheKey = `${date}:${cityId}`;
  const cached = dayCache.get(cacheKey);
  if (cached) return cached;

  const midnight = new Date(`${date}T00:00:00+05:30`);
  const observer = new Observer(city.latitude, city.longitude, 0);
  const sunrise = SearchRiseSet(Body.Sun, observer, 1, midnight, 1)?.date ?? null;
  const sunset = SearchRiseSet(Body.Sun, observer, -1, midnight, 1)?.date ?? null;
  const sampledAt = sunrise ?? new Date(`${date}T06:00:00+05:30`);
  const phase = MoonPhase(sampledAt);
  const number = Math.floor(phase / 12) + 1;
  const withinPaksha = ((number - 1) % 15) + 1;
  const name = number === 15 ? 'पूर्णिमा' : number === 30 ? 'अमावस्या' : TITHIS[withinPaksha - 1];
  const end = SearchMoonPhase((number * 12) % 360, sampledAt, 3);
  if (!end) throw new Error('Unable to calculate the tithi boundary.');
  const observances: string[] = [];
  if (withinPaksha === 11) observances.push('एकादशी तिथि');
  if (withinPaksha === 13) observances.push('त्रयोदशी तिथि');
  if (number === 15) observances.push('पूर्णिमा तिथि');
  if (number === 30) observances.push('अमावस्या तिथि');

  const result: PanchangDay = {
    date, city,
    sunrise: sunrise?.toISOString() ?? null,
    sunset: sunset?.toISOString() ?? null,
    sampledAt: sampledAt.toISOString(),
    weekday: new Intl.DateTimeFormat('hi-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' }).format(midnight),
    tithi: { number, name, paksha: number <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष', end: end.date.toISOString() },
    illumination: Math.round(Illumination(Body.Moon, sampledAt).phase_fraction * 100),
    moonPhase: phase < 180 ? 'बढ़ता चंद्रमा' : 'घटता चंद्रमा',
    observances,
  };
  if (dayCache.size >= 500) dayCache.delete(dayCache.keys().next().value!);
  dayCache.set(cacheKey, result);
  return result;
}

export function getMonthDays(month: string, cityId = 'new-delhi'): PanchangDay[] {
  if (!/^\d{4}-\d{2}$/.test(month) || !isValidDate(`${month}-01`)) throw new RangeError('Choose a valid month between 2020 and 2040.');
  const [year, monthNumber] = month.split('-').map(Number);
  const length = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return Array.from({ length }, (_, index) => getPanchang(`${month}-${String(index + 1).padStart(2, '0')}`, cityId));
}
