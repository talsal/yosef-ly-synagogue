import { fetchSheetRows } from './csv';

/**
 * מרנדר רשימת שורות מגיליון Google Sheets לתוך אלמנט, עם טיפול נאות במצב
 * שהגיליון ריק, לא זמין, או שעדיין לא חובר (csvUrl ריק).
 */
export async function renderSheetList(
	containerSelector: string,
	csvUrl: string,
	renderRow: (row: Record<string, string>) => string,
	emptyMessage: string,
): Promise<void> {
	const container = document.querySelector<HTMLElement>(containerSelector);
	if (!container) return;

	if (!csvUrl) {
		container.innerHTML = `<p class="error-state">${emptyMessage}</p>`;
		return;
	}

	try {
		const rows = await fetchSheetRows(csvUrl);
		if (rows.length === 0) {
			container.innerHTML = `<p class="error-state">${emptyMessage}</p>`;
			return;
		}
		container.innerHTML = rows.map(renderRow).join('');
	} catch {
		container.innerHTML = `<p class="error-state">אירעה שגיאה בטעינת המידע. נסו לרענן את העמוד.</p>`;
	}
}
