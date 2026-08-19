# בית הכנסת יוסף-לי — אתר קהילה

אתר סטטי (Astro) לבית הכנסת יוסף-לי, שכונת מוריה, מודיעין.
תוכנית האתר המלאה נמצאת ב-`planning/תוכנית-אתר.md`.

## פיתוח מקומי

```sh
npm install
npm run dev
```

## מבנה הפרויקט

- `src/pages/` &mdash; עמודי האתר (נתיב = מבנה התיקייה).
- `src/layouts/BaseLayout.astro` &mdash; שלד העמוד המשותף (RTL, ניווט, פוטר).
- `src/components/` &mdash; רכיבים משותפים, כולל הרכיבים ששולפים נתונים דינמיים
  (`ShabbatSchedule`, `UpcomingTimes`, `HolidayList`).
- `src/data/site.ts` &mdash; קבועים כלל-אתריים: שמות, ניווט, כתובות ה-CSV של הגיליונות.
- `src/content/lessons/` &mdash; שיעורי תורה קבועים (Astro content collection, ערוך בקוד).
- `src/lib/` &mdash; שליפת CSV מגיליונות Google Sheets, ו-API של Hebcal לזמני שבת/חגים.

## לוח שבת שבועי — מחושב אוטומטית, בלי גיליון

עמוד "זמני תפילות" **לא** תלוי בגיליון חיצוני. כניסת/יציאת שבת ופרשת השבוע
נשלפים מ-Hebcal, ושאר לוח השבת (מנחה, שיעורים, סעודה שלישית וכו') מחושב מהם
אוטומטית לפי הפרשי זמן קבועים שכוילו מול הדוגמה האמיתית של הקהילה (פרשת
שופטים) — ראו `src/lib/shabbatCompute.ts`.

היוצא מהכלל היחיד: **תורני הקידוש** מתחלפים כל שבוע בין חברי הקהילה ולא ניתן
לחשב אותם. יש לעדכן אותם ידנית כל שבוע ב-`CURRENT_KIDDUSH_TORANIM` בקובץ
`src/data/prayerTimes.ts` (שורה אחת, לפני push).

## תוכן דינמי (Google Sheets)

עמודים אלו שולפים נתונים בזמן טעינת הדף מגיליון Google Sheets שפורסם כ-CSV
(File → Share → Publish to web → CSV), כדי שמתנדבים יוכלו לעדכן בלי לגעת בקוד:

| עמוד | קבוע ב-`site.ts` | מבנה עמודות |
| --- | --- | --- |
| אירועים | `EVENTS_SHEET_CSV_URL` | `title, date, category, description` |
| אזכרות | `MEMORIALS_SHEET_CSV_URL` | `name, hebrew_date, contact` |
| רפואות | `REFUAH_SHEET_CSV_URL` | `hebrew_name, mother_hebrew_name` |
| עדכונים | `UPDATES_SHEET_CSV_URL` | `date, title, body` |
| עליות לתורה | `ALIYOT_SHEET_CSV_URL` | `aliyah_name, status, price` |

כל עוד קבוע ה-URL ריק, העמוד מציג הודעת "טרם חובר גיליון" ידידותית במקום שגיאה.

## פריסה (GitHub Pages)

`.github/workflows/deploy.yml` בונה ופורס אוטומטית ל-GitHub Pages בכל push ל-`main`.
לפני הפעלה ראשונה:

1. בהגדרות הריפו ב-GitHub: Settings → Pages → Source: "GitHub Actions".
2. עדכנו את `site` ב-`astro.config.mjs` לדומיין האמיתי.
3. אם יש דומיין מותאם אישית, הוסיפו קובץ `public/CNAME` עם הדומיין (שורה אחת), כדי
   ש-GitHub Pages ישמור על ה-CNAME בכל build.

## TODO פתוחים

חיפוש מהיר לפי `TODO` בקוד יאתר את כל המקומות הדורשים מידע אמיתי: פרטי קשר,
פרטי תרומה (בנק/ביט), שעות תפילה קבועות לימות החול, וחיבור גיליונות ה-Sheets.
