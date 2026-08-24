/** ממיר תאריך לועזי לתאריך עברי (כתיב עברי) דרך Hebcal API. רץ client-side. */

interface HebcalConverterResponse {
	heDateParts: { y: string; m: string; d: string };
}

export async function fetchTodayHebrewDate(): Promise<string | null> {
	const today = new Date();
	const gy = today.getFullYear();
	const gm = today.getMonth() + 1;
	const gd = today.getDate();

	const res = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${gy}&gm=${gm}&gd=${gd}&g2h=1`);
	if (!res.ok) return null;

	const data: HebcalConverterResponse = await res.json();
	const { y, m, d } = data.heDateParts;
	return `${d} ב${m} ${y}`;
}
