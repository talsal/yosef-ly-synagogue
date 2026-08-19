/** לוח חגים ומועדים קרובים למודיעין, דרך Hebcal API. רץ client-side. */

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
	category: string;
}

export async function fetchUpcomingHolidays(limit = 6): Promise<Holiday[]> {
	const res = await fetch(HEBCAL_URL);
	if (!res.ok) return [];

	const data: { items: HebcalItem[] } = await res.json();
	const today = new Date().toISOString().slice(0, 10);

	return data.items
		.filter((item) => item.category === 'holiday' && item.date >= today)
		.slice(0, limit)
		.map((item) => ({ title: item.hebrew ?? item.title, date: item.date }));
}
