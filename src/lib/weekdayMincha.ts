/**
 * מנחה בימות החול: זמן אחיד לכל השבוע (ראשון–חמישי) -- 20 דקות לפני השקיעה
 * של השבת הקרובה, מעוגל לחמש הדקות הקרובות. הכלל מתאים לשלושה שבועות שהגבאים
 * קבעו בפועל: 17:45 (11.10), 17:40 (18.10), 16:15 (שבוע 25.11).
 */

const MINUTES_BEFORE_SUNSET = 20;
const ROUND_MINUTES = 5;

/** תאריך השבת שקובעת את מנחת השבוע: מיום שישי/שבת מציגים את מנחת השבוע הבא (ראשון–חמישי הקרובים). */
export function shabbatDateFor(todayIsrael: string): string {
	const noon = new Date(`${todayIsrael}T12:00:00Z`);
	const dow = noon.getUTCDay(); // 0=ראשון ... 5=שישי, 6=שבת
	const daysToShabbat = dow >= 5 ? 13 - dow : 6 - dow;
	return new Date(noon.getTime() + daysToShabbat * 86_400_000).toISOString().slice(0, 10);
}

export function computeWeekdayMincha(shabbatSunset: Date): string {
	const mincha = new Date(shabbatSunset.getTime() - MINUTES_BEFORE_SUNSET * 60_000);
	const parts = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone: 'Asia/Jerusalem',
	}).formatToParts(mincha);
	const minutes = Number(parts.find((p) => p.type === 'hour')!.value) * 60 + Number(parts.find((p) => p.type === 'minute')!.value);
	const rounded = Math.round(minutes / ROUND_MINUTES) * ROUND_MINUTES;
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(Math.floor(rounded / 60) % 24)}:${pad(rounded % 60)}`;
}
