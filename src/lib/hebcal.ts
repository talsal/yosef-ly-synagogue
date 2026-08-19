/** שליפת כניסת/יציאת שבת ופרשת השבוע למודיעין דרך Hebcal API. רץ client-side. */

const HEBCAL_URL = 'https://www.hebcal.com/shabbat?cfg=json&geo=city&city=Modiin&M=on';

export interface ShabbatTimes {
	parasha: string;
	candleLighting: string;
	havdalah: string;
	/** תאריך/שעה מדויקים, לשימוש בחישוב שאר לוח הזמנים (ראו shabbatCompute.ts) */
	candleLightingDate: Date;
	havdalahDate: Date;
}

interface HebcalItem {
	title: string;
	date: string;
	category: string;
	hebrew?: string;
}

interface HebcalResponse {
	items: HebcalItem[];
}

function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('he-IL', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Jerusalem',
	}).format(date);
}

export async function fetchShabbatTimes(): Promise<ShabbatTimes | null> {
	const res = await fetch(HEBCAL_URL);
	if (!res.ok) return null;

	const data: HebcalResponse = await res.json();
	const candle = data.items.find((item) => item.category === 'candles');
	const havdalah = data.items.find((item) => item.category === 'havdalah');
	const parasha = data.items.find((item) => item.category === 'parashat');

	if (!candle || !havdalah) return null;

	const candleLightingDate = new Date(candle.date);
	const havdalahDate = new Date(havdalah.date);

	return {
		parasha: parasha?.hebrew ?? parasha?.title ?? '',
		candleLighting: formatTime(candleLightingDate),
		havdalah: formatTime(havdalahDate),
		candleLightingDate,
		havdalahDate,
	};
}
