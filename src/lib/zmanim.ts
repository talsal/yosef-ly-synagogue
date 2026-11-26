/** זמני היום ההלכתיים לפי הקואורדינטות המדויקות של בית הכנסת. רץ client-side. */

import { SYNAGOGUE_COORDS } from '../data/site';
import { MODIIN_LUACH } from '../data/modiinLuach';
import { computeWeekdayMincha, hhmmToMinutes, israelMinutesOfDay, shabbatDateFor, thursdayDateFor } from './weekdayMincha';

const ZMANIM_URL =
	`https://www.hebcal.com/zmanim?cfg=json&latitude=${SYNAGOGUE_COORDS.latitude}` +
	`&longitude=${SYNAGOGUE_COORDS.longitude}&tzid=Asia/Jerusalem`;

export interface DailyZmanim {
	alotHaShachar: string;
	sunrise: string;
	sofZmanShma: string;
	sofZmanTfilla: string;
	chatzot: string;
	/** חצות הלילה הקרוב: 12 שעות אחרי חצות היום (אותה נקודה במעגל השמש) */
	chatzotNight: string;
	minchaGedola: string;
	sunset: string;
	tzeitHakochavim: string;
}

interface ZmanimResponse {
	times: Record<string, string>;
}

function formatTime(iso: string): string {
	return new Intl.DateTimeFormat('he-IL', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Jerusalem',
	}).format(new Date(iso));
}

export async function fetchDailyZmanim(): Promise<DailyZmanim | null> {
	const res = await fetch(ZMANIM_URL);
	if (!res.ok) return null;

	const data: ZmanimResponse = await res.json();
	const t = data.times;
	if (!t.sunrise || !t.sunset) return null;

	return {
		alotHaShachar: formatTime(t.alotHaShachar),
		sunrise: formatTime(t.sunrise),
		sofZmanShma: formatTime(t.sofZmanShma),
		sofZmanTfilla: formatTime(t.sofZmanTfilla),
		chatzot: formatTime(t.chatzot),
		chatzotNight: formatTime(new Date(new Date(t.chatzot).getTime() + 12 * 3_600_000).toISOString()),
		minchaGedola: formatTime(t.minchaGedola),
		sunset: formatTime(t.sunset),
		tzeitHakochavim: formatTime(t.tzeit7083deg),
	};
}

/** מנחה אחידה לימות החול: 15 דקות לפני השקיעה של יום חמישי, מעוגל ל-5 (ראו lib/weekdayMincha.ts). null אם השליפה נכשלה. */
export async function fetchWeeklyMincha(): Promise<string | null> {
	const todayIsrael = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
	const shabbatIso = shabbatDateFor(todayIsrael);
	const luach = MODIIN_LUACH[shabbatIso];
	const [thursdaySunset, shabbatSunset] = await Promise.all([
		fetchSunsetForDate(thursdayDateFor(todayIsrael)),
		luach ? fetchSunsetForDate(shabbatIso) : Promise.resolve(null),
	]);
	if (!thursdaySunset) return null;
	// כיול ללוח מודיעין: ההפרש בין הלוח ל-Hebcal באותה שבת
	const correction = luach && shabbatSunset ? hhmmToMinutes(luach.sunset) - israelMinutesOfDay(shabbatSunset) : 0;
	return computeWeekdayMincha(israelMinutesOfDay(thursdaySunset) + correction);
}

/** שקיעה מדויקת (לפי קואורדינטות בית הכנסת) ליום נתון, yyyy-mm-dd לפי שעון ישראל. */
export async function fetchSunsetForDate(isoDate: string): Promise<Date | null> {
	const res = await fetch(`${ZMANIM_URL}&date=${isoDate}`);
	if (!res.ok) return null;
	const data: ZmanimResponse = await res.json();
	return data.times.sunset ? new Date(data.times.sunset) : null;
}
