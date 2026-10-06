/**
 * לוח תורני הקידוש. הזוגות מתחלפים במחזור קבוע וחוזר (התחלף כל שבוע לפי הסדר,
 * דילוג על שבת שחלה בה ראש השנה בלי לצרוך תור מהמחזור).
 *
 * הטבלה למטה היא הנתונים המדויקים שנמסרו (כ"ו בתמוז תשפ"ו – א' בשבט תשפ"ז,
 * 11/7/2026–9/1/2027). מעבר לטווח הזה, getToranimForShabbat ממשיך את המחזור
 * אוטומטית מתוך 13 הזוגות הייחודיים שבטבלה, בהנחה שלא תהיה עוד שבת "מדלגת"
 * כמו ראש השנה. TODO: כדאי להאריך את הטבלה הזו מדי כמה חודשים כדי לוודא
 * דיוק מלא סביב חגים עתידיים.
 *
 * שמות המשפחה מקוצרים לאות ראשונה + ׳ כבר כאן במקור (ולא רק בתצוגה), כי הריפו
 * ציבורי -- מי שפותח את הקובץ הזה ישירות בגיטהאב לא אמור לראות שם משפחה מלא.
 */

export interface ToranimEntry {
	parasha: string;
	/** תאריך השבת (שבת בבוקר), ISO */
	date: string;
	pair: [string, string] | null;
}

export const TORANIM_TABLE: ToranimEntry[] = [
	{ parasha: 'מטות מסעי (מברכים)', date: '2026-07-11', pair: ['ניר ד׳', 'יוני ל׳'] },
	{ parasha: 'דברים (חזון)', date: '2026-07-18', pair: ['יצחק ד׳', 'רן ע׳'] },
	{ parasha: 'ואתחנן (נחמו)', date: '2026-07-25', pair: ['יגאל ט׳', 'רן ע׳'] },
	{ parasha: 'עקב', date: '2026-08-01', pair: ['מוטי ק׳', 'יואב ט׳'] },
	{ parasha: 'ראה (מברכים)', date: '2026-08-08', pair: ['דרור ב׳', 'אביעד י׳'] },
	{ parasha: 'שופטים', date: '2026-08-15', pair: ['משה ס׳', 'ישראל ע׳'] },
	{ parasha: 'כי תצא', date: '2026-08-22', pair: ['שרון מ׳', 'ערן ז׳'] },
	{ parasha: 'כי תבוא', date: '2026-08-29', pair: ['גיא ב׳', 'ישראל ע׳'] },
	{ parasha: 'ניצבים וילך', date: '2026-09-05', pair: ['משה ס׳', 'אריה מ׳'] },
	{ parasha: 'ראש השנה', date: '2026-09-12', pair: null },
	{ parasha: 'שובה (האזינו)', date: '2026-09-19', pair: ['זאב מ׳', 'אילן ב׳'] },
	{ parasha: 'סוכות', date: '2026-09-26', pair: ['רותם ד׳', 'צדוק ביגי ה׳'] },
	{ parasha: 'שמחת תורה', date: '2026-10-03', pair: ['משה מ׳', 'שי י׳'] },
	{ parasha: 'בראשית (מברכים)', date: '2026-10-10', pair: ['דן א׳', 'אורן ס׳'] },
	{ parasha: 'נח', date: '2026-10-17', pair: ['ניר ד׳', 'יוני ל׳'] },
	{ parasha: 'לך-לך', date: '2026-10-24', pair: ['יצחק ד׳', 'רן ע׳'] },
	{ parasha: 'וירא', date: '2026-10-31', pair: ['יגאל ט׳', 'רן ע׳'] },
	{ parasha: 'חיי שרה (מברכים)', date: '2026-11-07', pair: ['מוטי ק׳', 'יואב ט׳'] },
	{ parasha: 'תולדות', date: '2026-11-14', pair: ['דרור ב׳', 'אביעד י׳'] },
	{ parasha: 'ויצא', date: '2026-11-21', pair: ['משה ס׳', 'ישראל ע׳'] },
	{ parasha: 'וישלח', date: '2026-11-28', pair: ['שרון מ׳', 'ערן ז׳'] },
	{ parasha: 'וישב (מברכים, א׳ חנוכה)', date: '2026-12-05', pair: ['גיא ב׳', 'יגאל מ׳'] },
	{ parasha: 'מקץ (ח׳ חנוכה)', date: '2026-12-12', pair: ['יחיאל בן ש׳', 'אריה מ׳'] },
	{ parasha: 'ויגש', date: '2026-12-19', pair: ['זאב מ׳', 'אילן ב׳'] },
	{ parasha: 'ויחי', date: '2026-12-26', pair: ['רותם ד׳', 'צדוק ביגי ה׳'] },
	{ parasha: 'שמות (מברכים)', date: '2027-01-02', pair: ['משה מ׳', 'שי י׳'] },
	{ parasha: 'וארא (ראש חודש)', date: '2027-01-09', pair: ['דן א׳', 'אורן ס׳'] },
];

function uniquePairsInOrder(): [string, string][] {
	const seen = new Set<string>();
	const cycle: [string, string][] = [];
	for (const entry of TORANIM_TABLE) {
		if (!entry.pair) continue;
		const key = entry.pair.join('|');
		if (seen.has(key)) continue;
		seen.add(key);
		cycle.push(entry.pair);
	}
	return cycle;
}

/** מזהה זוג תורנים לשבת נתונה (yyyy-mm-dd, תאריך השבת עצמו). */
export function getToranimForShabbat(isoDate: string): [string, string] | null {
	const exact = TORANIM_TABLE.find((entry) => entry.date === isoDate);
	if (exact) return exact.pair;

	const lastEntry = TORANIM_TABLE[TORANIM_TABLE.length - 1];
	if (!lastEntry.pair) return null;

	const cycle = uniquePairsInOrder();
	const lastIndex = cycle.findIndex(
		([a, b]) => lastEntry.pair && a === lastEntry.pair[0] && b === lastEntry.pair[1],
	);
	if (lastIndex === -1) return null;

	const lastDate = new Date(`${lastEntry.date}T12:00:00+03:00`);
	const targetDate = new Date(`${isoDate}T12:00:00+03:00`);
	const weeksAhead = Math.round(
		(targetDate.getTime() - lastDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
	);
	if (weeksAhead <= 0) return null;

	const index = (((lastIndex + weeksAhead) % cycle.length) + cycle.length) % cycle.length;
	return cycle[index];
}
