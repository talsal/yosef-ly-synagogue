/** זמני היום ההלכתיים לפי הקואורדינטות המדויקות של בית הכנסת. רץ client-side. */

import { SYNAGOGUE_COORDS } from '../data/site';
import { computeWeeklyMincha, weekdayDatesFor } from './weekdayMincha';

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

/** מנחה אחידה לכל שבוע (ראשון–חמישי) -- ראו lib/weekdayMincha.ts. null אם אחת הבקשות נכשלה. */
export async function fetchWeeklyMincha(): Promise<string | null> {
	const todayIsrael = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
	const responses = await Promise.all(
		weekdayDatesFor(todayIsrael).map((date) => fetch(`${ZMANIM_URL}&date=${date}`)),
	);
	if (responses.some((res) => !res.ok)) return null;
	const sunsets: Date[] = [];
	for (const res of responses) {
		const data: ZmanimResponse = await res.json();
		if (!data.times.sunset) return null;
		sunsets.push(new Date(data.times.sunset));
	}
	return computeWeeklyMincha(sunsets);
}

/** שקיעה מדויקת (לפי קואורדינטות בית הכנסת) ליום נתון, yyyy-mm-dd לפי שעון ישראל. */
export async function fetchSunsetForDate(isoDate: string): Promise<Date | null> {
	const res = await fetch(`${ZMANIM_URL}&date=${isoDate}`);
	if (!res.ok) return null;
	const data: ZmanimResponse = await res.json();
	return data.times.sunset ? new Date(data.times.sunset) : null;
}
