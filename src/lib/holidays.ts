/** לוח חגים ומועדים קרובים למודיעין, דרך Hebcal API. רץ client-side. */

import { toHebrewYear } from './hebrewNumerals';

const HEBCAL_URL =
	'https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&year=now&month=x&geo=city&city=Modiin&M=on';

export interface Holiday {
	title: string;
	date: string;
}

interface HebcalItem {
	title: string;
	hebrew?: string;
	date: string;
	hdate?: string;
	category: string;
}

function resolveTitle(item: HebcalItem): string {
	// Hebcal's Hebrew title for ראש השנה כולל את השנה כספרות (למשל "ראש השנה 5787").
	// מציגים במקום זאת "יום ראשון/שני" עם השנה העברית באותיות.
	const yearMatch = item.hdate?.match(/(\d+)$/);
	const hebrewYear = yearMatch ? toHebrewYear(Number(yearMatch[1])) : '';

	if (/^Rosh Hashana \d+$/.test(item.title)) {
		return `ראש השנה יום ראשון${hebrewYear ? ` ${hebrewYear}` : ''}`;
	}
	if (item.title === 'Rosh Hashana II') {
		return `ראש השנה יום שני${hebrewYear ? ` ${hebrewYear}` : ''}`;
	}

	return item.hebrew ?? item.title;
}

export async function fetchUpcomingHolidays(limit = 6): Promise<Holiday[]> {
	const res = await fetch(HEBCAL_URL);
	if (!res.ok) return [];

	const data: { items: HebcalItem[] } = await res.json();
	const today = new Date().toISOString().slice(0, 10);

	return data.items
		.filter((item) => item.category === 'holiday' && item.date >= today)
		.slice(0, limit)
		.map((item) => ({ title: resolveTitle(item), date: item.date }));
}
