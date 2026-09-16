// רשימת עסקים של חברי קהילה, מוצגים באתר בתשלום. מבנה: שם, תחום, תיאור קצר,
// ולינק יצירת קשר (אתר/אינסטגרם/וואטסאפ).
export interface CommunityBusiness {
	name: string;
	category: string;
	description: string;
	contactLabel: string;
	contactHref: string;
	/** אמוג'י כתחליף ללוגו/תמונה אמיתית, עד שיהיו לנו נכסי עיצוב אמיתיים מהמפרסם */
	icon: string;
	/** צבע תג האייקון — נבחר מפלטת המותג כדי שכל מפרסם יבלוט קצת אחרת בלי לצאת מהעיצוב */
	accent: string;
}

export const COMMUNITY_BUSINESSES: CommunityBusiness[] = [
	{
		name: 'אומן הפרקטים והקרמיקה',
		category: 'קרמיקה, סניטציה ופרקטים',
		description:
			'יבוא ושיווק קרמיקה, כלים סניטריים, פרקטים, ארונות אמבטיה ונגרות, ומקלחונים בהתאמה אישית — עיצוב הבית במקום אחד. מתחייבים למוצרים ולמחירים הטובים ביותר.',
		contactLabel: 'לעמוד האינסטגרם',
		contactHref: 'https://www.instagram.com/oman_haparketim_vehakeramika/',
		icon: '🪵',
		accent: '#c9a24b',
	},
];
