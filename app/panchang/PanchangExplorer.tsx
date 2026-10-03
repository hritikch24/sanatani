'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { CITIES, formatHindiDate, getIndiaDate, getMonthDays, getPanchang } from '../lib/panchang';
import './panchang.css';

const MIN_DATE = '2020-01-01';
const MAX_DATE = '2040-12-31';
const CITY_STORAGE_KEY = 'sanatani-panchang-city';
const WEEKDAYS = [
  ['सोम', 'सोमवार'], ['मंगल', 'मंगलवार'], ['बुध', 'बुधवार'],
  ['गुरु', 'गुरुवार'], ['शुक्र', 'शुक्रवार'], ['शनि', 'शनिवार'], ['रवि', 'रविवार'],
];
const SIGNAL_PATTERN = /एकादशी|त्रयोदशी|प्रदोष|पूर्णिमा|अमावस्या|ekadashi|pradosh|purnima|amavasya/i;
const TIME_FORMAT = new Intl.DateTimeFormat('hi-IN', {
  timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit',
});
const END_FORMAT = new Intl.DateTimeFormat('hi-IN', {
  timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
});
const MONTH_FORMAT = new Intl.DateTimeFormat('hi-IN', {
  timeZone: 'UTC', month: 'long', year: 'numeric',
});
const NUMBER_FORMAT = new Intl.NumberFormat('hi-IN-u-nu-deva');

function utcDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && value >= MIN_DATE && value <= MAX_DATE
    && dateString(utcDate(value)) === value;
}

function shiftDay(value: string, amount: number) {
  const date = utcDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateString(date);
}

function shiftMonth(value: string, amount: number) {
  const date = utcDate(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return dateString(date);
}

function formatTime(value: string | null, includeDate = false) {
  if (!value || !/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return 'समय उपलब्ध नहीं';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'समय उपलब्ध नहीं';
  return (includeDate ? END_FORMAT : TIME_FORMAT).format(date);
}

function escapeCalendar(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function foldCalendarLine(value: string) {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let line = '';
  let bytes = 0;
  for (const character of value) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      lines.push(line);
      line = ' ';
      bytes = 1;
    }
    line += character;
    bytes += size;
  }
  lines.push(line);
  return lines.join('\r\n');
}

type ExplorerProps = {
  initialDate: string;
  initialCity?: string;
  mode?: 'day' | 'month';
};

export default function PanchangExplorer({ initialDate, initialCity = 'new-delhi', mode = 'day' }: ExplorerProps) {
  const initialValid = validDate(initialDate);
  const initialSelectedDate = initialValid ? initialDate : MIN_DATE;
  const defaultCity = CITIES.find(city => city.id === initialCity)?.id ?? CITIES[0].id;
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [dateInput, setDateInput] = useState(initialValid ? initialDate : '');
  const [cityId, setCityId] = useState<string>(defaultCity);
  const [view, setView] = useState(mode);
  const [inputError, setInputError] = useState(initialValid ? '' : 'कृपया 2020 से 2040 के बीच की सही तारीख चुनें। अभी 1 जनवरी 2020 दिखाया जा रहा है।');
  const [storageNotice, setStorageNotice] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [fallbackLink, setFallbackLink] = useState('');
  const [sharing, setSharing] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const calendarRef = useRef<HTMLTableElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const identifier = useId();
  const month = selectedDate.slice(0, 7);
  const day = useMemo(() => getPanchang(selectedDate, cityId), [selectedDate, cityId]);
  const monthDays = useMemo(() => view === 'month' ? getMonthDays(month, cityId) : [], [month, cityId, view]);
  const signals = useMemo(() => monthDays.flatMap(entry => {
    const observances = entry.observances.filter(name => SIGNAL_PATTERN.test(name));
    return observances.length ? [{ date: entry.date, observances }] : [];
  }), [monthDays]);
  const firstWeekday = (utcDate(`${month}-01`).getUTCDay() + 6) % 7;
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...monthDays,
    ...Array.from({ length: (7 - (firstWeekday + monthDays.length) % 7) % 7 }, () => null),
  ];
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const monthLabel = MONTH_FORMAT.format(utcDate(`${month}-01`));
  const daySignals = day.observances.filter(name => SIGNAL_PATTERN.test(name));

  useEffect(() => {
    try {
      if (!new URLSearchParams(window.location.search).has('city')) {
        const savedCity = window.localStorage.getItem(CITY_STORAGE_KEY);
        const supportedCity = CITIES.find(city => city.id === savedCity);
        if (supportedCity) setCityId(supportedCity.id);
      }
    } catch {
      setStorageNotice('इस ब्राउज़र में शहर सहेजा नहीं जा सका। आप नीचे शहर चुन सकते हैं।');
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(CITY_STORAGE_KEY, cityId);
      setStorageNotice('');
    } catch {
      setStorageNotice('इस ब्राउज़र में शहर सहेजा नहीं जा सका। आपका चयन इस पेज पर बना रहेगा।');
    }
  }, [cityId, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    const url = new URL(window.location.href);
    url.searchParams.set('date', selectedDate);
    url.searchParams.set('city', cityId);
    if (mode === 'month') url.searchParams.set('month', selectedDate.slice(0, 7));
    else url.searchParams.delete('month');
    if (url.toString() !== window.location.href) {
      window.history.replaceState(window.history.state, '', url.toString());
    }
  }, [selectedDate, cityId, mode, storageReady]);

  useEffect(() => {
    function restoreSelection() {
      const query = new URLSearchParams(window.location.search);
      const requestedDate = query.get('date');
      const requestedMonth = query.get('month');
      const requestedCity = query.get('city');
      let restoredDate = requestedDate && validDate(requestedDate) ? requestedDate : initialSelectedDate;
      if (mode === 'month' && requestedMonth && validDate(`${requestedMonth}-01`)
        && restoredDate.slice(0, 7) !== requestedMonth) {
        restoredDate = `${requestedMonth}-01`;
      }
      const restoredCity = CITIES.find(city => city.id === requestedCity)?.id ?? defaultCity;
      setSelectedDate(restoredDate);
      setDateInput(restoredDate);
      setCityId(restoredCity);
      setInputError(requestedDate && !validDate(requestedDate) ? 'लिंक की तारीख सही नहीं है। कृपया 2020 से 2040 के बीच की तारीख चुनें।' : '');
      setActionStatus('');
    }
    window.addEventListener('popstate', restoreSelection);
    return () => window.removeEventListener('popstate', restoreSelection);
  }, [initialSelectedDate, defaultCity, mode]);

  useEffect(() => {
    if (pendingFocus.current && view === 'month') {
      calendarRef.current?.querySelector<HTMLButtonElement>(`[data-date="${pendingFocus.current}"]`)?.focus();
      pendingFocus.current = null;
    }
  }, [selectedDate, view]);

  function selectDate(value: string) {
    if (!validDate(value)) {
      setInputError('कृपया 1 जनवरी 2020 से 31 दिसंबर 2040 के बीच की सही तारीख चुनें।');
      return;
    }
    setSelectedDate(value);
    setDateInput(value);
    setInputError('');
    setActionStatus('');
  }

  function changeMonth(value: string) {
    if (!/^\d{4}-\d{2}$/.test(value) || !validDate(`${value}-01`)) {
      setInputError('कृपया जनवरी 2020 से दिसंबर 2040 के बीच का महीना चुनें।');
      return;
    }
    const lastDay = new Date(Date.UTC(Number(value.slice(0, 4)), Number(value.slice(5, 7)), 0)).getUTCDate();
    const dayNumber = Math.min(Number(selectedDate.slice(8, 10)), lastDay);
    selectDate(`${value}-${String(dayNumber).padStart(2, '0')}`);
  }

  function calendarKey(event: KeyboardEvent<HTMLButtonElement>, value: string) {
    const weekday = (utcDate(value).getUTCDay() + 6) % 7;
    let nextDate: string;
    switch (event.key) {
      case 'ArrowLeft': nextDate = shiftDay(value, -1); break;
      case 'ArrowRight': nextDate = shiftDay(value, 1); break;
      case 'ArrowUp': nextDate = shiftDay(value, -7); break;
      case 'ArrowDown': nextDate = shiftDay(value, 7); break;
      case 'Home': nextDate = shiftDay(value, -weekday); break;
      case 'End': nextDate = shiftDay(value, 6 - weekday); break;
      case 'PageUp': nextDate = shiftMonth(value, -1); break;
      case 'PageDown': nextDate = shiftMonth(value, 1); break;
      default: return;
    }
    event.preventDefault();
    if (!validDate(nextDate)) return;
    pendingFocus.current = nextDate;
    selectDate(nextDate);
    if (nextDate === selectedDate) {
      calendarRef.current?.querySelector<HTMLButtonElement>(`[data-date="${nextDate}"]`)?.focus();
      pendingFocus.current = null;
    }
  }

  async function shareDay() {
    setSharing(true);
    setActionStatus('');
    const url = new URL(mode === 'month' ? '/hindu-calendar' : '/panchang', window.location.origin);
    url.searchParams.set('date', selectedDate);
    url.searchParams.set('city', cityId);
    if (mode === 'month') url.searchParams.set('month', month);
    setFallbackLink(url.toString());
    const text = `${formatHindiDate(selectedDate)} · ${day.city.name}\n${day.tithi.paksha} ${day.tithi.name}\nसूर्योदय: ${formatTime(day.sunrise)} · सूर्यास्त: ${formatTime(day.sunset)}\nअनुमानित खगोलीय तिथि कैलेंडर; व्रत की तारीख स्थानीय पंचांग से जाँचें।`;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: 'सनातन परिवार · पंचांग', text, url: url.toString() });
          setActionStatus('साझा करने की प्रक्रिया पूरी हुई।');
          return;
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            setActionStatus('साझा करना रद्द किया गया।');
            return;
          }
        }
      }
      if (!navigator.clipboard?.writeText) {
        setActionStatus('इस ब्राउज़र में साझा करना उपलब्ध नहीं है। नीचे दिया गया लिंक कॉपी करें।');
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url.toString()}`);
      setActionStatus('पंचांग और लिंक कॉपी हो गए। अब इन्हें साझा कर सकते हैं।');
    } catch {
      setActionStatus('लिंक कॉपी नहीं हो सका। नीचे दिया गया लिंक चुनकर कॉपी करें।');
    } finally {
      setSharing(false);
    }
  }

  function downloadCalendar() {
    try {
      const description = `${day.tithi.paksha} ${day.tithi.name}\n${daySignals.length ? `तिथि संकेत: ${daySignals.join(', ')}\n` : ''}सूर्योदय: ${formatTime(day.sunrise)}\nसूर्यास्त: ${formatTime(day.sunset)}\nसीमित खगोलीय तिथि कैलेंडर। यह प्रमाणित कर्मकांड पंचांग नहीं है। व्रत की तारीख स्थानीय पंचांग से जाँचें।`;
      const content = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sanatan Parivar//Panchang//HI',
        'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        `UID:panchang-${selectedDate}-${cityId}@sanatanparivar`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
        `DTSTART;VALUE=DATE:${selectedDate.replace(/-/g, '')}`,
        `DTEND;VALUE=DATE:${shiftDay(selectedDate, 1).replace(/-/g, '')}`,
        `SUMMARY:${escapeCalendar(`पंचांग · ${day.tithi.name} · ${day.city.name}`)}`,
        `LOCATION:${escapeCalendar(day.city.name)}`,
        `DESCRIPTION:${escapeCalendar(description)}`, 'TRANSP:TRANSPARENT',
        'END:VEVENT', 'END:VCALENDAR',
      ].map(foldCalendarLine).join('\r\n') + '\r\n';
      const objectUrl = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `panchang-${selectedDate}-${cityId}.ics`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setActionStatus('कैलेंडर फ़ाइल तैयार है। इसे अपने कैलेंडर में पूरे दिन की प्रविष्टि के रूप में जोड़ें।');
    } catch {
      setActionStatus('कैलेंडर फ़ाइल नहीं बन सकी। कृपया दोबारा कोशिश करें।');
    }
  }

  const manualShare = actionStatus.includes('नीचे दिया गया लिंक');

  return (
    <section className="panchang-explorer" lang="hi" aria-labelledby={`${identifier}-title`}>
      <header className="px-heading">
        <span className="px-eyebrow"><span aria-hidden="true">✦</span> दिन, तिथि और चंद्रमा</span>
        <h2 id={`${identifier}-title`}>अपने दिन की तिथि देखें</h2>
        <p>अपने शहर के आकाश से जुड़ें। एक दिन चुनें या पूरे महीने के तिथि संकेत देखें।</p>
      </header>

      <form className="px-controls" onSubmit={event => event.preventDefault()} aria-label="पंचांग का दिन और शहर चुनें">
        <label className="px-field" htmlFor={`${identifier}-date`}>
          <span>तारीख चुनें</span>
          <input id={`${identifier}-date`} type="date" min={MIN_DATE} max={MAX_DATE} value={dateInput}
            aria-invalid={Boolean(inputError)} aria-describedby={`${identifier}-range${inputError ? ` ${identifier}-error` : ''}`}
            onChange={event => { setDateInput(event.target.value); selectDate(event.target.value); }} />
        </label>
        <label className="px-field" htmlFor={`${identifier}-city`}>
          <span>आपका शहर</span>
          <select id={`${identifier}-city`} value={cityId} onChange={event => { setCityId(event.target.value); setActionStatus(''); }}>
            {CITIES.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </label>
        <button type="button" className="px-button px-today" onClick={() => selectDate(getIndiaDate())}>
          <span aria-hidden="true">↺</span> आज देखें
        </button>
        <span className="px-range" id={`${identifier}-range`}>2020–2040 · सभी समय भारतीय मानक समय (IST)</span>
      </form>
      {inputError && <p className="px-error" id={`${identifier}-error`} role="alert">{inputError}</p>}
      {storageNotice && <p className="px-storage" role="status">{storageNotice}</p>}

      <div className="px-view-switch" role="group" aria-label="पंचांग का दृश्य">
        <button type="button" aria-pressed={view === 'day'} onClick={() => setView('day')}>दिन का पंचांग</button>
        <button type="button" aria-pressed={view === 'month'} onClick={() => setView('month')}>मासिक कैलेंडर</button>
      </div>

      <p className="px-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {formatHindiDate(selectedDate)}, {day.city.name}। {day.tithi.paksha} {day.tithi.name}। {view === 'month' ? `${monthLabel} का कैलेंडर।` : 'दिन का पंचांग।'}
      </p>

      <div className={`px-layout${view === 'month' ? ' px-layout-month' : ''}`}>
        {view === 'month' && (
          <div className="px-month-panel">
            <div className="px-month-navigation">
              <button className="px-icon-button" type="button" aria-label="पिछला महीना" disabled={month === '2020-01'} onClick={() => selectDate(shiftMonth(selectedDate, -1))}>‹</button>
              <h3 id={`${identifier}-month-title`}>{monthLabel}</h3>
              <button className="px-icon-button" type="button" aria-label="अगला महीना" disabled={month === '2040-12'} onClick={() => selectDate(shiftMonth(selectedDate, 1))}>›</button>
            </div>
            <label className="px-month-picker" htmlFor={`${identifier}-month`}>
              महीना चुनें
              <input id={`${identifier}-month`} type="month" value={month} min="2020-01" max="2040-12" onChange={event => changeMonth(event.target.value)} />
            </label>
            <p className="px-sr-only" id={`${identifier}-keyboard`}>तीर कुंजियों से दिन बदलें। Home और End से सप्ताह का पहला या अंतिम दिन चुनें। Page Up और Page Down से महीना बदलें।</p>
            <table className="px-calendar" role="grid" ref={calendarRef} aria-labelledby={`${identifier}-month-title`} aria-describedby={`${identifier}-keyboard`}>
              <thead><tr role="row">{WEEKDAYS.map(([shortName, fullName]) => <th key={fullName} scope="col" role="columnheader" aria-label={fullName}>{shortName}</th>)}</tr></thead>
              <tbody>{weeks.map((week, weekIndex) => (
                <tr key={weekIndex} role="row">{week.map((entry, cellIndex) => (
                  <td key={entry?.date ?? `empty-${cellIndex}`} role="gridcell">
                    {entry && <button type="button" className="px-calendar-day" data-date={entry.date}
                      aria-pressed={selectedDate === entry.date} tabIndex={selectedDate === entry.date ? 0 : -1}
                      aria-label={`${formatHindiDate(entry.date)}, ${entry.tithi.paksha} ${entry.tithi.name}${entry.observances.length ? `, तिथि संकेत: ${entry.observances.join(', ')}` : ''}`}
                      onClick={() => selectDate(entry.date)} onKeyDown={event => calendarKey(event, entry.date)}>
                      <span className="px-date-number">{NUMBER_FORMAT.format(Number(entry.date.slice(8, 10)))}</span>
                      <span className="px-cell-tithi">{entry.tithi.name}</span>
                      <span className="px-cell-dot" data-signal={entry.observances.some(name => SIGNAL_PATTERN.test(name))} aria-hidden="true" />
                    </button>}
                  </td>
                ))}</tr>
              ))}</tbody>
            </table>
            <p className="px-calendar-legend"><span aria-hidden="true" /> तिथि संकेत वाला दिन · दिन चुनकर विवरण देखें</p>
            <div className="px-observances">
              <h3>इस महीने के तिथि संकेत</h3>
              <p>एकादशी, त्रयोदशी, पूर्णिमा और अमावस्या के सूर्योदय तिथि संकेत। ये निश्चित व्रत की तारीखें नहीं हैं; त्रयोदशी का संकेत प्रदोष व्रत की पुष्टि नहीं है।</p>
              {signals.length ? <ul>{signals.map(entry => (
                <li key={entry.date}><button type="button" aria-pressed={selectedDate === entry.date} onClick={() => selectDate(entry.date)}>
                  <span className="px-signal-date">{NUMBER_FORMAT.format(Number(entry.date.slice(8, 10)))}</span>
                  <span><strong>{entry.observances.join(' · ')}</strong><span>{formatHindiDate(entry.date)}</span></span>
                  <span aria-hidden="true">↗</span>
                </button></li>
              ))}</ul> : <p className="px-empty">इस महीने के लिए तिथि संकेत उपलब्ध नहीं हैं। किसी दिन का विवरण चुनकर देखें।</p>}
            </div>
          </div>
        )}

        <div className="px-day-panel" aria-labelledby={`${identifier}-day-title`}>
          <div className="px-day-navigation">
            <button className="px-icon-button" type="button" aria-label="पिछला दिन" disabled={selectedDate === MIN_DATE} onClick={() => selectDate(shiftDay(selectedDate, -1))}>‹</button>
            <div><span>{day.city.name} · {day.weekday}</span><h3 id={`${identifier}-day-title`}>{formatHindiDate(selectedDate)}</h3></div>
            <button className="px-icon-button" type="button" aria-label="अगला दिन" disabled={selectedDate === MAX_DATE} onClick={() => selectDate(shiftDay(selectedDate, 1))}>›</button>
          </div>
          <div className="px-tithi-card">
            <span className="px-tithi-orbit" aria-hidden="true">☾</span>
            <span className="px-tithi-label">{day.sunrise ? 'सूर्योदय की तिथि' : 'सुबह 06:00 IST की तिथि'}</span>
            <span className="px-paksha">{day.tithi.paksha}</span>
            <p className="px-tithi-name">{day.tithi.name}</p>
            <p>तिथि समाप्ति: {formatTime(day.tithi.end, true)} (IST)</p>
            <span className="px-estimate">अनुमानित गणना</span>
          </div>
          <dl className="px-sun-times">
            <div><dt><span aria-hidden="true">☀</span> सूर्योदय</dt><dd>{formatTime(day.sunrise)}</dd></div>
            <div><dt><span aria-hidden="true">◒</span> सूर्यास्त</dt><dd>{formatTime(day.sunset)}</dd></div>
          </dl>
          {!day.sunrise && <p className="px-fallback">सूर्योदय उपलब्ध नहीं है; तिथि की गणना सुबह 06:00 IST के आधार पर है।</p>}
          <dl className="px-details">
            <div><dt>चंद्र अवस्था</dt><dd>{day.moonPhase || 'उपलब्ध नहीं'}</dd></div>
            <div><dt>चंद्र प्रकाश</dt><dd>{Number.isFinite(day.illumination) ? `${NUMBER_FORMAT.format(Math.round(Math.min(100, Math.max(0, day.illumination))))}%` : 'उपलब्ध नहीं'}</dd></div>
          </dl>
          <div className="px-day-signals">
            <h4>इस दिन के तिथि संकेत</h4>
            {daySignals.length ? <ul>{daySignals.map(name => <li key={name}>{name}</li>)}</ul> : <p>इन चार प्रमुख तिथियों का संकेत इस दिन नहीं है।</p>}
          </div>
          <div className="px-actions">
            <button type="button" className="px-button px-button-primary" onClick={shareDay} disabled={sharing}>{sharing ? 'साझा हो रहा है…' : '↗ पंचांग साझा करें'}</button>
            <button type="button" className="px-button" onClick={downloadCalendar}>↓ कैलेंडर फ़ाइल (.ics)</button>
          </div>
          <p className="px-action-status" role="status" aria-live="polite" aria-atomic="true">{actionStatus}</p>
          {manualShare && <a className="px-share-link" href={fallbackLink}>{fallbackLink}</a>}
        </div>
      </div>

      <aside className="px-note" aria-labelledby={`${identifier}-note`}>
        <span aria-hidden="true">✦</span>
        <div><h3 id={`${identifier}-note`}>श्रद्धा के साथ, सही जानकारी भी</h3>
          <p>यह सीमित खगोलीय तिथि कैलेंडर स्थानीय सूर्योदय पर आधारित है; सूर्योदय न मिलने पर सुबह 06:00 IST लिया जाता है। यह मुहूर्त, पारण समय या प्रमाणित कर्मकांड पंचांग नहीं देता। तिथि संकेत को निश्चित व्रत की तारीख न मानें। व्रत और अनुष्ठान के लिए अपने स्थानीय पंचांग या आचार्य से पुष्टि करें।</p>
        </div>
      </aside>
    </section>
  );
}
