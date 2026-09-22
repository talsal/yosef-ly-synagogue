/** זמני היום ההלכתיים לפי הקואורדינטות המדויקות של בית הכנסת. רץ client-side. */

import { SYNAGOGUE_COORDS } from '../data/site';

const ZMANIM_URL =
	`https://www.hebcal.com/zmanim?cfg=json&latitude=${SYNAGOGUE_COORDS.latitude}` +
	`&longitude=${SYNAGOGUE_COORDS.longitude}&tzid=Asia/Jerusalem`;

export interface DailyZmanim {
	alotHaShachar: string;
	sunrise: string;
	sofZmanShma: string;
	sofZmanTfilla: string;
	chatzot: string;
	minchaGedola: string;
	sunset: string;
	/** שקיעה כ-ISO גולמי, כדי לאפשר חישוב זמנים יחסיים אליה (למשל מנחה = שקיעה פחות 20 דקות) */
	sunsetIso: string;
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

/** מחזיר זמן בפורמט HH:MM, X דקות לפני זמן ה-ISO הנתון (למשל מנחה = שקיעה פחות 20 דקות) */
export function formatTimeMinusMinutes(iso: string, minutes: number): string {
	const date = new Date(new Date(iso).getTime() - minutes * 60_000);
	return formatTime(date.toISOString());
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
		minchaGedola: formatTime(t.minchaGedola),
		sunset: formatTime(t.sunset),
		sunsetIso: t.sunset,
		tzeitHakochavim: formatTime(t.tzeit7083deg),
	};
}
