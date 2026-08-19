// זמני תפילה קבועים לימות החול — תוכן יציב, נערך כאן בקוד.
// TODO: להשלים את הזמנים האמיתיים מול הגבאי/רב הקהילה.

export interface WeekdayTimes {
	shacharit: string;
	mincha: string;
	arvit: string;
}

export const WEEKDAY_TIMES: { summer: WeekdayTimes; winter: WeekdayTimes } = {
	summer: {
		shacharit: '',
		mincha: '',
		arvit: '',
	},
	winter: {
		shacharit: '',
		mincha: '',
		arvit: '',
	},
};

// חתימת לוח הזמנים, כפי שמופיעה בלוח השבת השבועי
export const SCHEDULE_SIGNATURE = 'רב הקהילה הרב אופיר בן סעדון והוועד';
