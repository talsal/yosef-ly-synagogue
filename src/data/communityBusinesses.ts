// רשימת פריטים ללוח המודעות המתחלף בעמוד הבית. שני סוגים מתחלפים באותו
// מנגנון: 'ad' — עסק של חבר קהילה, בתשלום; 'community' — הודעת שירות
// לציבור, חינמית (למשל השאלת ציוד, טרמפים וכו'), בלי contactHref/מחיר.
export interface CommunityBusiness {
	name: string;
	category: string;
	description: string;
	contactLabel: string;
	contactHref: string;
	/** אמוג'י כתחליף ללוגו/תמונה אמיתית, עד שיהיו לנו נכסי עיצוב אמיתיים מהמפרסם */
	icon: string;
	/** צבע תג האייקון — נבחר מפלטת המותג כדי שכל פריט יבלוט קצת אחרת בלי לצאת מהעיצוב */
	accent: string;
	/** 'ad' — עסק בתשלום (מוצג כ"פרסומת"). 'community' — הודעת שירות לציבור, חינם (מוצג כ"הודעת קהילה") */
	kind: 'ad' | 'community';
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
		kind: 'ad',
	},
];
