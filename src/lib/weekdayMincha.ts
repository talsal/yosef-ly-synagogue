/**
 * מנחה בימות החול: זמן אחיד לכל השבוע (ראשון–חמישי), לפי השקיעה המוקדמת
 * בשבוע פחות 20 דקות, מעוגל כלפי מטה ל-5 דקות. הכלל נגזר משני שבועות
 * שהגבאים קבעו בפועל (17:45 לשבוע של 11.10, 17:40 לשבוע של 18.10).
 */

const MINUTES_BEFORE_SUNSET = 20;
const ROUND_MINUTES = 5;

/** תאריכי ראשון–חמישי של השבוע הרלוונטי: מיום שישי/שבת מציגים את השבוע הבא. */
export function weekdayDatesFor(todayIsrael: string): string[] {
	const noon = new Date(`${todayIsrael}T12:00:00Z`);
	const dow = noon.getUTCDay(); // 0=ראשון ... 6=שבת
	const daysToSunday = dow >= 5 ? 7 - dow : -dow;
	return Array.from({ length: 5 }, (_, i) => {
		const d = new Date(noon.getTime() + (daysToSunday + i) * 86_400_000);
		return d.toISOString().slice(0, 10);
	});
}

function israelMinutesOfDay(date: Date): number {
	const parts = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone: 'Asia/Jerusalem',
	}).formatToParts(date);
	const hour = Number(parts.find((p) => p.type === 'hour')!.value);
	const minute = Number(parts.find((p) => p.type === 'minute')!.value);
	return hour * 60 + minute;
}

/** sunsets = שקיעות ימי ראשון–חמישי של אותו שבוע; הזמן המוקדם ביותר ביום (לא התאריך המוקדם) קובע. */
export function computeWeeklyMincha(sunsets: Date[]): string {
	const earliestSunset = Math.min(...sunsets.map(israelMinutesOfDay));
	const total =
		Math.floor((earliestSunset - MINUTES_BEFORE_SUNSET) / ROUND_MINUTES) * ROUND_MINUTES;
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}
