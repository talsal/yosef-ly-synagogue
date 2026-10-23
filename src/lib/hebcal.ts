/**
 * שליפת כניסת/יציאת שבת ופרשת השבוע למודיעין דרך Hebcal API. רץ client-side.
 *
 * הקהילה פועלת לפי לוחות מודיעין: כניסת שבת = שקיעה פחות 18 דקות, צאת שבת =
 * שקיעה ועוד 33 דקות (נבדק מול 17:41/18:31 של 23-24.10 ומול 19:07/19:57 של
 * 14-15.8) -- Hebcal נותן 17:39/18:35, אז ליום שישי/שבת רגילים מחשבים מהשקיעה
 * המדויקת. בערבי חג ובמוצאי חג נשארים עם הזמנים של Hebcal.
 */
import { fetchSunsetForDate } from './zmanim';

const CANDLE_MINUTES_BEFORE_SUNSET = 18;
const HAVDALAH_MINUTES_AFTER_SUNSET = 33;

function israelIsoDate(date: Date): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(date);
}

function weekdayOfIsoDate(iso: string): number {
	return new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0=ראשון ... 5=שישי, 6=שבת
}

// טווח רחב (לא רק "השבת הקרובה") כדי לא להישבר כששבת חופפת לחג רב-יומי
// (למשל ראש השנה): ה-endpoint הצר של /shabbat לפעמים מחזיר הדלקת נרות של
// ערב החג בלי את ההבדלה המתאימה, כי ההבדלה בפועל יוצאת רק אחרי יומיים.
function buildHebcalUrl(): string {
	const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
	const end = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(
		new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
	);
	return `https://www.hebcal.com/hebcal?cfg=json&v=1&geo=city&city=Modiin&start=${today}&end=${end}&c=on&maj=on&min=on&s=on`;
}

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
	const res = await fetch(buildHebcalUrl());
	if (!res.ok) return null;

	const data: HebcalResponse = await res.json();
	const now = Date.now();

	// הנר הקרוב ביותר בעתיד (יכול להיות ערב שבת רגילה, או ערב חג שחל בשבת)
	const upcomingCandles = data.items
		.filter((item) => item.category === 'candles' && new Date(item.date).getTime() > now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	const candle = upcomingCandles[0];
	if (!candle) return null;

	// ההבדלה הבאה אחרי אותה הדלקת נרות (לא בהכרח באותו "טווח" קצר —
	// בחג דו-יומי כמו ראש השנה ההבדלה בפועל יוצאת רק יומיים אחרי)
	const candleTime = new Date(candle.date).getTime();
	const upcomingHavdalah = data.items
		.filter((item) => item.category === 'havdalah' && new Date(item.date).getTime() > candleTime)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	const havdalah = upcomingHavdalah[0];
	if (!havdalah) return null;

	const parasha = data.items.find(
		(item) =>
			item.category === 'parashat' &&
			new Date(item.date).getTime() >= candleTime &&
			new Date(item.date).getTime() <= new Date(havdalah.date).getTime(),
	);

	let candleLightingDate = new Date(candle.date);
	let havdalahDate = new Date(havdalah.date);

	const candleIso = israelIsoDate(candleLightingDate);
	const havdalahIso = israelIsoDate(havdalahDate);
	if (weekdayOfIsoDate(candleIso) === 5 && weekdayOfIsoDate(havdalahIso) === 6) {
		const [fridaySunset, saturdaySunset] = await Promise.all([
			fetchSunsetForDate(candleIso).catch(() => null),
			fetchSunsetForDate(havdalahIso).catch(() => null),
		]);
		if (fridaySunset) {
			candleLightingDate = new Date(fridaySunset.getTime() - CANDLE_MINUTES_BEFORE_SUNSET * 60_000);
		}
		if (saturdaySunset) {
			havdalahDate = new Date(saturdaySunset.getTime() + HAVDALAH_MINUTES_AFTER_SUNSET * 60_000);
		}
	}

	return {
		parasha: parasha?.hebrew ?? parasha?.title ?? '',
		candleLighting: formatTime(candleLightingDate),
		havdalah: formatTime(havdalahDate),
		candleLightingDate,
		havdalahDate,
	};
}
