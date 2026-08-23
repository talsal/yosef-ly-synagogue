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
	parasha: 'כי תצא',
	sales: [
		{ aliyah: 'פתיחה', name: 'זאב מנחם', price: 101 },
		{ aliyah: 'הולכה', name: 'יחיאל', price: 100 },
		{ aliyah: 'הגבהה', name: 'שרון מזרחי', price: 101 },
		{ aliyah: 'כהן', name: '', price: null },
		{ aliyah: 'לוי', name: 'טרבלסי', price: 150 },
		{ aliyah: 'שלישי', name: 'ניר דוד', price: 260 },
		{ aliyah: 'רביעי', name: 'רענן יהונתן', price: 200 },
		{ aliyah: 'חמישי', name: 'משה מזרחי', price: 202 },
		{ aliyah: 'שישי', name: 'קוסקס', price: 100 },
		{ aliyah: 'שביעי', name: 'רמי ב. סעדון', price: 200 },
		{ aliyah: 'מפטיר', name: 'טרבלסי', price: null },
	],
};
