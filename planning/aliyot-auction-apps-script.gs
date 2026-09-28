// קוד ה-"שרת" למכירה הפומבית של עליות לתורה (src/pages/aliyot-auction.astro).
// זה לא קובץ שרץ בבנייה של האתר -- הוא נועד להדבקה ידנית לתוך עורך Google
// Apps Script המחובר לגיליון ייעודי, ופריסה כ-Web App. ראו את הוראות ההקמה
// שנמסרו לגבאי לפרטים המלאים.

const TZ = 'Asia/Jerusalem';
const CLOSE_HOUR = 10; // המכירה נסגרת ביום שישי בשעה הזו (שעון ישראל)
const SHEET_NAME = 'מכירה';
const ALIYOT = ['כהן', 'לוי', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'מפטיר'];

function doGet(e) {
	const action = e.parameter.action;
	if (action === 'status') return jsonOut(buildStatus());
	if (action === 'bid') return jsonOut(placeBid(e.parameter));
	return jsonOut({ ok: false, error: 'unknown-action' });
}

function jsonOut(obj) {
	return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// היום/שעה בישראל קובעים לאיזו שבת המכירה הנוכחית שייכת (השבת הקרובה),
// ואם המכירה כבר נסגרה (יום שישי אחרי CLOSE_HOUR, או שבת עצמה).
function getWeekStatus() {
	const now = new Date();
	const isoWeekday = Number(Utilities.formatDate(now, TZ, 'u')); // 1=שני .. 7=ראשון
	const dayOfWeek = isoWeekday % 7; // 0=ראשון .. 6=שבת
	const hour = Number(Utilities.formatDate(now, TZ, 'H'));
	const daysUntilSat = (6 - dayOfWeek + 7) % 7;
	const weekStartDate = new Date(now.getTime() + daysUntilSat * 86400000);
	const weekStart = Utilities.formatDate(weekStartDate, TZ, 'yyyy-MM-dd');
	const isClosed = (dayOfWeek === 5 && hour >= CLOSE_HOUR) || dayOfWeek === 6;
	return { weekStart, isClosed };
}

function getSheet() {
	const ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getSheetByName(SHEET_NAME);
	if (!sheet) {
		sheet = ss.insertSheet(SHEET_NAME);
		sheet.appendRow(['weekStart', 'aliyah', 'name', 'price', 'updatedAt']);
	}
	return sheet;
}

function buildStatus() {
	const { weekStart, isClosed } = getWeekStatus();
	const sheet = getSheet();
	const data = sheet.getDataRange().getValues();
	const map = {};
	for (let i = 1; i < data.length; i++) {
		if (data[i][0] === weekStart) {
			map[data[i][1]] = { name: data[i][2], price: Number(data[i][3]) || 0 };
		}
	}
	const rows = ALIYOT.map((aliyah) => ({
		aliyah,
		name: map[aliyah] ? map[aliyah].name : '',
		price: map[aliyah] ? map[aliyah].price : 0,
	}));
	return { ok: true, weekStart, isClosed, rows };
}

function placeBid(p) {
	const weekStart = p.weekStart;
	const aliyah = p.aliyah;
	const name = (p.name || '').toString().trim().slice(0, 60);
	const price = Number(p.price);

	if (ALIYOT.indexOf(aliyah) === -1) return { ok: false, error: 'invalid-aliyah' };
	if (!name) return { ok: false, error: 'invalid-name' };
	if (!price || price <= 0) return { ok: false, error: 'invalid-price' };

	const current = getWeekStatus();
	if (weekStart !== current.weekStart) return { ok: false, error: 'stale-week' };
	if (current.isClosed) return { ok: false, error: 'closed' };

	const lock = LockService.getScriptLock();
	lock.waitLock(10000);
	try {
		const sheet = getSheet();
		const data = sheet.getDataRange().getValues();
		let rowNum = -1;
		let currentPrice = 0;
		let currentName = '';
		for (let i = 1; i < data.length; i++) {
			if (data[i][0] === weekStart && data[i][1] === aliyah) {
				rowNum = i + 1;
				currentPrice = Number(data[i][3]) || 0;
				currentName = data[i][2] || '';
				break;
			}
		}
		if (price <= currentPrice) {
			return { ok: false, error: 'too-low', current: { name: currentName, price: currentPrice } };
		}
		const now = new Date().toISOString();
		if (rowNum > -1) {
			sheet.getRange(rowNum, 3, 1, 3).setValues([[name, price, now]]);
		} else {
			sheet.appendRow([weekStart, aliyah, name, price, now]);
		}
		return { ok: true, current: { aliyah, name, price } };
	} finally {
		lock.releaseLock();
	}
}
