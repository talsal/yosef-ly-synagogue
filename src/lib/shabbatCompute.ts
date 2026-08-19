/**
 * לוח השבת השבועי המלא, מחושב אוטומטית מכניסת/יציאת שבת (ללא גיליון Google Sheets).
 *
 * הכיול נעשה מול הדוגמה האמיתית שהתקבלה מהקהילה (פרשת שופטים: כניסת שבת 19:07,
 * יציאת שבת 19:57) — ראו planning/source-materials/weekly-shabbat-schedule-example-shoftim.pdf.
 * זמני ליל שבת מחושבים כהפרש קבוע (בדקות) מכניסת שבת, וזמני שבת אחה"צ/ערב
 * מחושבים כהפרש קבוע מיציאת שבת, כך שהלוח מתעדכן אוטומטית משבוע לשבוע לפי
 * העונה. זמני הבוקר (שיעור/שחרית/קידוש) אינם תלויים בשקיעה ולכן קבועים.
 *
 * TODO: תורני הקידוש משתנים כל שבוע בין חברי הקהילה ולא ניתנים לחישוב —
 * יש לעדכן ידנית כל שבוע ב-CURRENT_KIDDUSH_TORANIM (src/data/prayerTimes.ts).
 */

import { CURRENT_KIDDUSH_TORANIM } from '../data/prayerTimes';

const OFFSET_MINUTES = {
	minchaArvitEarly: -72, // ליל שבת: מנחה וערבית מוקדמות, לפני כניסת שבת
	shirHashirim: -12, // ליל שבת: שיר השירים, לפני כניסת שבת
	shiurAfternoon: -142, // שבת: שיעור אחה"צ, לפני יציאת שבת
	minchaShabbat: -77, // שבת: מנחה של שבת, לפני יציאת שבת
	seudaShlishit: -47, // שבת: סעודה שלישית, לפני יציאת שבת
} as const;

// זמני בוקר קבועים — לא תלויים בעונה/בשקיעה
const FIXED_MORNING = {
	shiurBeforeShacharit: { time: '6:30', teacher: 'חכם רונן' },
	shacharit: '8:00',
	kiddush: '10:30',
	shiurAfterKiddush: { time: '10:35', teacher: 'חכם ינון שוויקה' },
};

export interface WeeklySchedule {
	mincha_arvit_early: string;
	shir_hashirim_time: string;
	mincha_candle_time: string;
	shiur_before_shacharit: string;
	shacharit_time: string;
	kiddush_toranim: string;
	shiur_after_kiddush: string;
	shiur_afternoon: string;
	mincha_shabbat: string;
	seuda_shlishit: string;
	arvit_motzash: string;
}

function addMinutes(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60_000);
}

function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('he-IL', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Jerusalem',
	}).format(date);
}

export function computeWeeklySchedule(candleLighting: Date, havdalah: Date): WeeklySchedule {
	return {
		mincha_arvit_early: formatTime(addMinutes(candleLighting, OFFSET_MINUTES.minchaArvitEarly)),
		shir_hashirim_time: formatTime(addMinutes(candleLighting, OFFSET_MINUTES.shirHashirim)),
		mincha_candle_time: formatTime(candleLighting),
		shiur_before_shacharit: `${FIXED_MORNING.shiurBeforeShacharit.time} – ${FIXED_MORNING.shiurBeforeShacharit.teacher}`,
		shacharit_time: FIXED_MORNING.shacharit,
		kiddush_toranim: `${FIXED_MORNING.kiddush} – ${CURRENT_KIDDUSH_TORANIM || 'יעודכן ע"י הוועד'}`,
		shiur_after_kiddush: `${FIXED_MORNING.shiurAfterKiddush.time} – ${FIXED_MORNING.shiurAfterKiddush.teacher}`,
		shiur_afternoon: formatTime(addMinutes(havdalah, OFFSET_MINUTES.shiurAfternoon)),
		mincha_shabbat: formatTime(addMinutes(havdalah, OFFSET_MINUTES.minchaShabbat)),
		seuda_shlishit: formatTime(addMinutes(havdalah, OFFSET_MINUTES.seudaShlishit)),
		arvit_motzash: formatTime(havdalah),
	};
}
