/**
 * שליפת תוכן שמתמלא ע"י חברי הקהילה דרך Google Form, מגיליון Google Sheets
 * שפורסם כ-CSV (File > Share > Publish to web > CSV). רץ client-side, כך
 * שמילוי הטופס משתקף באתר מיידית בלי build מחדש.
 */

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
