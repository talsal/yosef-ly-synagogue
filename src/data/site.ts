// מוסיף את ה-base path (GitHub Pages: /yosef-ly-synagogue) לקישור פנימי, למשל
// withBase('/tefillah-times') -> "/yosef-ly-synagogue/tefillah-times"
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const clean = path.replace(/^\//, '').replace(/\/$/, '');
	return clean ? `${base}/${clean}` : base;
}

// שמות האתר — ראו planning/תוכנית-אתר.md, "מבנה שמות"
export const SITE_NAME = 'בית הכנסת יוסף-לי';
export const SITE_NAME_EN = 'Beit HaKnesset Yosef-Li';
export const NEIGHBORHOOD = 'שכונת מוריה, מודיעין';
export const ORG_NAME = 'עמותת ניצוץ הקדושה';
export const HALL_NAME = 'היכל שלמה ויעקב';
export const RABBI_NAME = 'הרב אופיר בן סעדון';
export const SITE_TAGLINE = 'עשו לי מקדש ושכנתי בתוכם';

// TODO: להשלים טלפון, וואטסאפ ומייל
export const CONTACT = {
	phone: '',
	whatsapp: '',
	email: '',
	address: 'יעל הגיבורה 66, מודיעין מכבים רעות',
};

// קואורדינטות מדויקות של כתובת בית הכנסת (geocoding חד-פעמי מול OpenStreetMap),
// לשימוש בחישוב זמני היום ההלכתיים (src/lib/zmanim.ts) במקום מרכז העיר הכללי.
export const SYNAGOGUE_COORDS = { latitude: 31.882533, longitude: 35.0101906 };

// גיליון Google Sheets המחובר לטופס "רישום אזכרות", מפורסם כ-CSV (Publish to
// web), כדי שחברי הקהילה ימלאו בעצמם בלי לעבור דרך גבאי/מתנדב טכני.
export const MEMORIALS_FORM_URL =
	'https://docs.google.com/forms/d/e/1FAIpQLScIn6OM0NsF5Z62bgS_ZnDYjcLETv743clbVT-XmyNPRrOh-A/viewform';
export const MEMORIALS_SHEET_CSV_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRX81jLSOpcKHr7meAU9nYJfk8eSJP4LdB9o4jjHhp15KkXq9dwvLS8uP-F3ms8vtWfhop4Frw1FyFB/pub?output=csv';

export interface NavItem {
	label: string;
	href: string;
	/** true אם העמוד עדיין לא בנוי במלואו */
	comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
	{ label: 'בית', href: '/' },
	{ label: 'זמני תפילות', href: '/tefillah-times' },
	{ label: 'שיעורי תורה', href: '/lessons' },
	{ label: 'אירועים', href: '/events' },
	{ label: 'אזכרות', href: '/memorials' },
	{ label: 'רפואות', href: '/refuah' },
	{ label: 'עדכונים', href: '/updates' },
	{ label: 'תרומות', href: '/donations' },
	{ label: 'עליות לתורה', href: '/aliyot' },
	{ label: 'אודות', href: '/about' },
	{ label: 'חברות', href: '/membership' },
	{ label: 'גלריה', href: '/gallery' },
	{ label: 'יצירת קשר', href: '/contact' },
];
