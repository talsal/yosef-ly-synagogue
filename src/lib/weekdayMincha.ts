/**
 * מנחה בימות החול: זמן אחיד לכל השבוע (ראשון–חמישי) = 15 דקות לפני השקיעה
 * של יום חמישי של אותו שבוע, מעוגל ל-5 הדקות הקרובות (לפי הגבאי).
 * דוגמה: שקיעה 16:38 → 16:23 → 16:25.
 *
 * השקיעה ביום חמישי נלקחת מ-Hebcal ומכוילת ללוח מודיעין: מוסיפים לה את
 * ההפרש בין השקיעה בלוח לשקיעה ב-Hebcal באותה שבת (בד"כ כ-2 דקות), כדי
 * שהמספרים יתאימו ללוח המודפס שהגבאים עובדים לפיו.
 */

const MINUTES_BEFORE_SUNSET = 15;
const ROUND_TO = 5;
const DAY_MS = 86_400_000;

/** תאריך השבת הקרובה: מיום שישי/שבת -- השבת של השבוע הבא. */
export function shabbatDateFor(todayIsrael: string): string {
	const noon = new Date(`${todayIsrael}T12:00:00Z`);
	const dow = noon.getUTCDay(); // 0=ראשון ... 5=שישי, 6=שבת
	const daysToShabbat = dow >= 5 ? 13 - dow : 6 - dow;
	return new Date(noon.getTime() + daysToShabbat * DAY_MS).toISOString().slice(0, 10);
}

/** יום חמישי שקובע את מנחת השבוע (ראשון–חמישי הנוכחיים, או הבאים אם היום שישי/שבת). */
export function thursdayDateFor(todayIsrael: string): string {
	const shabbat = new Date(`${shabbatDateFor(todayIsrael)}T12:00:00Z`);
	return new Date(shabbat.getTime() - 2 * DAY_MS).toISOString().slice(0, 10);
}

/** דקות מתחילת היום לפי שעון ישראל. */
export function israelMinutesOfDay(date: Date): number {
	const parts = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone: 'Asia/Jerusalem',
	}).formatToParts(date);
	return Number(parts.find((p) => p.type === 'hour')!.value) * 60 + Number(parts.find((p) => p.type === 'minute')!.value);
}

export function hhmmToMinutes(hhmm: string): number {
	return Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));
}

/** שקיעה (בדקות מתחילת היום) → זמן מנחה "HH:MM": פחות 15 דקות, מעוגל ל-5 הקרובות. */
export function computeWeekdayMincha(sunsetMinutes: number): string {
	const total = Math.round((sunsetMinutes - MINUTES_BEFORE_SUNSET) / ROUND_TO) * ROUND_TO;
	return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
