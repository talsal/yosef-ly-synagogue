/**
 * לוח זמני הדלקת נרות תשפ"ז של מודיעין-מכבים-רעות (הלוח המודפס שהקהילה פועלת
 * לפיו). מפתח = תאריך השבת (yyyy-mm-dd). שבתות שחלות בחג/ערב חג מרובה-ימים
 * (ראש השנה, פסח, שבועות) הושמטו -- שם חל לוח מיוחד. הזמנים הם שעון הקיר
 * המקומי (כולל מעבר שעון קיץ). כניסת שבת = שקיעה פחות 20, צאת שבת = שקיעה
 * ועוד 29-32 דקות.
 */
export interface LuachRow {
	candle: string;
	sunset: string;
	motzash: string;
}

export const MODIIN_LUACH: Record<string, LuachRow> = {
	'2026-10-10': { candle: '17:57', sunset: '18:17', motzash: '18:47' },
	'2026-10-17': { candle: '17:49', sunset: '18:09', motzash: '18:39' },
	'2026-10-24': { candle: '17:41', sunset: '18:01', motzash: '18:31' },
	'2026-10-31': { candle: '16:34', sunset: '16:54', motzash: '17:24' },
	'2026-11-07': { candle: '16:28', sunset: '16:48', motzash: '17:19' },
	'2026-11-14': { candle: '16:24', sunset: '16:44', motzash: '17:14' },
	'2026-11-21': { candle: '16:20', sunset: '16:40', motzash: '17:11' },
	'2026-11-28': { candle: '16:18', sunset: '16:38', motzash: '17:09' },
	'2026-12-05': { candle: '16:18', sunset: '16:38', motzash: '17:09' },
	'2026-12-12': { candle: '16:19', sunset: '16:39', motzash: '17:10' },
	'2026-12-19': { candle: '16:21', sunset: '16:41', motzash: '17:12' },
	'2026-12-26': { candle: '16:24', sunset: '16:44', motzash: '17:16' },
	'2027-01-02': { candle: '16:29', sunset: '16:49', motzash: '17:21' },
	'2027-01-09': { candle: '16:34', sunset: '16:54', motzash: '17:26' },
	'2027-01-16': { candle: '16:40', sunset: '17:00', motzash: '17:32' },
	'2027-01-23': { candle: '16:47', sunset: '17:07', motzash: '17:39' },
	'2027-01-30': { candle: '16:53', sunset: '17:13', motzash: '17:45' },
	'2027-02-06': { candle: '17:00', sunset: '17:20', motzash: '17:51' },
	'2027-02-13': { candle: '17:06', sunset: '17:26', motzash: '17:57' },
	'2027-02-20': { candle: '17:12', sunset: '17:32', motzash: '18:03' },
	'2027-02-27': { candle: '17:17', sunset: '17:37', motzash: '18:09' },
	'2027-03-06': { candle: '17:23', sunset: '17:43', motzash: '18:14' },
	'2027-03-13': { candle: '17:28', sunset: '17:48', motzash: '18:19' },
	'2027-03-20': { candle: '17:33', sunset: '17:53', motzash: '18:24' },
	'2027-03-27': { candle: '18:37', sunset: '18:57', motzash: '19:29' },
	'2027-04-03': { candle: '18:42', sunset: '19:02', motzash: '19:34' },
	'2027-04-10': { candle: '18:47', sunset: '19:07', motzash: '19:38' },
	'2027-04-17': { candle: '18:52', sunset: '19:12', motzash: '19:43' },
	'2027-04-24': { candle: '18:55', sunset: '19:15', motzash: '19:47' },
	'2027-05-01': { candle: '19:01', sunset: '19:21', motzash: '19:53' },
	'2027-05-08': { candle: '19:06', sunset: '19:26', motzash: '19:58' },
	'2027-05-15': { candle: '19:11', sunset: '19:31', motzash: '20:03' },
	'2027-05-22': { candle: '19:16', sunset: '19:36', motzash: '20:08' },
	'2027-05-29': { candle: '19:21', sunset: '19:41', motzash: '20:12' },
	'2027-06-05': { candle: '19:24', sunset: '19:44', motzash: '20:16' },
	'2027-06-19': { candle: '19:30', sunset: '19:50', motzash: '20:21' },
	'2027-06-26': { candle: '19:32', sunset: '19:52', motzash: '20:23' },
	'2027-07-03': { candle: '19:32', sunset: '19:52', motzash: '20:23' },
	'2027-07-10': { candle: '19:31', sunset: '19:51', motzash: '20:22' },
	'2027-07-17': { candle: '19:29', sunset: '19:49', motzash: '20:19' },
	'2027-07-24': { candle: '19:25', sunset: '19:45', motzash: '20:16' },
	'2027-07-31': { candle: '19:21', sunset: '19:41', motzash: '20:11' },
	'2027-08-07': { candle: '19:15', sunset: '19:35', motzash: '20:05' },
	'2027-08-14': { candle: '19:08', sunset: '19:28', motzash: '19:58' },
	'2027-08-21': { candle: '19:01', sunset: '19:21', motzash: '19:51' },
	'2027-08-28': { candle: '18:53', sunset: '19:13', motzash: '19:42' },
	'2027-09-04': { candle: '18:44', sunset: '19:04', motzash: '19:34' },
	'2027-09-11': { candle: '18:35', sunset: '18:55', motzash: '19:25' },
	'2027-09-18': { candle: '18:26', sunset: '18:46', motzash: '19:15' },
	'2027-09-25': { candle: '18:17', sunset: '18:37', motzash: '19:06' },
};
