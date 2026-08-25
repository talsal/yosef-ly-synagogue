/**
 * שליפת תוכן שמתמלא ע"י חברי הקהילה דרך Google Form, מגיליון Google Sheets
 * שפורסם כ-CSV (File > Share > Publish to web > CSV). רץ client-side, כך
 * שמילוי הטופס משתקף באתר מיידית בלי build מחדש.
 */

/**
 * בריחת HTML לערכים שמגיעים מהגיליון (קלט חופשי מטופס Google Form, ולכן
 * לא אמין) לפני הכנסתם ל-innerHTML, כדי שלא יתאפשר להריץ קוד דרך שם/שדה
 * שמכיל תגיות HTML.
 */
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * מילות/דפוסים חשודים שמעידים על ספאם, פרסומת או תוכן לא הולם, ולא על שם
 * אמיתי. משמש לסינון אוטומטי של שורות מהתצוגה הציבורית (ראו isSuspicious) —
 * בלי לחסום את השליחה עצמה ובלי צורך במישהו שיאשר כל רשומה ידנית.
 */
const SUSPICIOUS_PATTERNS = [
	/https?:\/\//i, // קישור
	/www\./i, // קישור
	/\d{7,}/, // רצף ספרות ארוך (טלפון וכדומה)
	/<[a-z!/][^>]*>/i, // תגית HTML
	/\b(fuck|shit|bitch|porn|viagra|casino)\b/i,
	/(זונה|מניאק|בן זונה|שרמוטה)/,
];

/** בודק אם טקסט חשוד כספאם/תוכן לא הולם, לצורך סינון אוטומטי מהתצוגה. */
export function isSuspicious(value: string): boolean {
	return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

export async function fetchSheetRows(csvUrl: string): Promise<Record<string, string>[]> {
	const res = await fetch(csvUrl);
	if (!res.ok) {
		throw new Error(`שגיאה בטעינת הגיליון: ${res.status}`);
	}
	const text = await res.text();
	return parseCsv(text);
}

export function parseCsv(text: string): Record<string, string>[] {
	const rows = splitCsvRows(text).filter((row) => row.some((cell) => cell.trim() !== ''));
	if (rows.length === 0) return [];

	const [header, ...body] = rows;
	return body.map((row) => {
		const record: Record<string, string> = {};
		header.forEach((key, i) => {
			record[key.trim()] = (row[i] ?? '').trim();
		});
		return record;
	});
}

/** פרסר CSV מינימלי התומך במרכאות, פסיקים ושורות בתוך תא. */
function splitCsvRows(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = '';
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const next = text[i + 1];

		if (inQuotes) {
			if (char === '"' && next === '"') {
				cell += '"';
				i++;
			} else if (char === '"') {
				inQuotes = false;
			} else {
				cell += char;
			}
		} else if (char === '"') {
			inQuotes = true;
		} else if (char === ',') {
			row.push(cell);
			cell = '';
		} else if (char === '\n') {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
		} else if (char === '\r') {
			// skip, \n שמגיע אחריו יסגור את השורה
		} else {
			cell += char;
		}
	}

	if (cell.length > 0 || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}

	return rows;
}
