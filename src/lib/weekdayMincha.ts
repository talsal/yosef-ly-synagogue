/**
 * מנחה בימות החול: זמן אחיד לכל השבוע (ראשון–חמישי) = בדיוק 20 דקות לפני
 * השקיעה של השבת הקרובה, לפי לוח מודיעין (data/modiinLuach.ts), בלי עיגול.
 * מחוץ לטווח הלוח: אותו חישוב לפי השקיעה של Hebcal.
 */

const MINUTES_BEFORE_SUNSET = 20;

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
	return `${parts.find((p) => p.type === 'hour')!.value}:${parts.find((p) => p.type === 'minute')!.value}`;
}

/** "HH:MM" פחות 20 דקות, לשקיעה מהלוח. */
export function minusTwentyMinutes(hhmm: string): string {
	const total = Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3)) - MINUTES_BEFORE_SUNSET;
	return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
