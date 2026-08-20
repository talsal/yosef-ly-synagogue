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

// TODO: להשלים פרטי קשר אמיתיים
export const CONTACT = {
	phone: '',
	whatsapp: '',
	email: '',
	address: `${NEIGHBORHOOD}`,
};

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
