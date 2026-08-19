/** ממיר שנה עברית מספרית (למשל 5787) לכתיב עברי באותיות (תשפ״ז), ללא הספרה אלפים. */
export function toHebrewYear(year: number): string {
	let n = year % 1000;
	const parts: string[] = [];

	while (n >= 400) {
		parts.push('ת');
		n -= 400;
	}

	const hundreds = ['', 'ק', 'ר', 'ש', 'ת'];
	const hundredDigit = Math.floor(n / 100);
	if (hundredDigit > 0) parts.push(hundreds[hundredDigit]);
	n %= 100;

	if (n === 15) {
		parts.push('טו');
		n = 0;
	} else if (n === 16) {
		parts.push('טז');
		n = 0;
	} else {
		const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
		const tensDigit = Math.floor(n / 10);
		if (tensDigit > 0) parts.push(tens[tensDigit]);
		n %= 10;

		const units = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
		if (n > 0) parts.push(units[n]);
	}

	const letters = parts.join('');
	if (letters.length <= 1) return `${letters}׳`;
	return `${letters.slice(0, -1)}״${letters.slice(-1)}`;
}
