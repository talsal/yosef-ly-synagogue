// תוצאות מכירת העליות האחרונה — נמכרות בעל פה בבית הכנסת בכל שבת לפני קריאת
// התורה (הגבאי מכריז, הקהל מציע מחיר, הזוכה הוא המציע הגבוה ביותר), והגבאי
// רושם את התוצאות אחרי שבת. אין מכירה מקוונת מראש — יש לעדכן כאן ידנית כל שבוע.
// TODO: לעדכן כל שבוע לפי הרישום של הגבאי

export interface AliyahSale {
	aliyah: string;
	name: string;
	price: number | null;
}

export const LAST_ALIYOT_SALE: { parasha: string; sales: AliyahSale[] } = {
	parasha: 'משפטים',
	sales: [
		{ aliyah: 'פתיחה', name: 'חנן גפן', price: 120 },
		{ aliyah: 'הולכה', name: 'דניאל יעקובוף', price: 120 },
		{ aliyah: 'הגבהה', name: 'בכר ישראל', price: 150 },
		{ aliyah: 'כהן', name: 'סיימון', price: 209 },
		{ aliyah: 'לוי', name: 'סיימון', price: 300 },
		{ aliyah: 'שלישי', name: 'דניאל יעקובוף', price: 200 },
		{ aliyah: 'רביעי', name: 'יוני לוי', price: 180 },
		{ aliyah: 'חמישי', name: 'אילן בוטבול', price: 120 },
		{ aliyah: 'שישי', name: 'מאור', price: 300 },
		{ aliyah: 'שביעי', name: '', price: null },
		{ aliyah: 'מפטיר', name: 'יגאל שטרית', price: 300 },
	],
};
