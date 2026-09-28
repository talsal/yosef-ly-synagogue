/**
 * מקצר שם מלא לשם פרטי + אות ראשונה של שם המשפחה (למשל "דוד כהן" -> "דוד
 * כ׳"), כדי להקשות על צילוב אוטומטי/ידני (OSINT) מול שם מלא במאגרי מידע
 * חיצוניים — גם כשזיהוי בתוך הקהילה עצמה עדיין קל. לא נוגע בנתוני המקור
 * (המחזור/הגיליון), רק בתצוגה הפומבית.
 */
export function truncateSurname(fullName: string): string {
	const parts = fullName.trim().split(/\s+/);
	if (parts.length < 2) return fullName;
	const given = parts.slice(0, -1).join(' ');
	const surnameInitial = parts[parts.length - 1][0];
	return `${given} ${surnameInitial}׳`;
}
