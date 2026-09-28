// Generated from the seating chart PDF (public/documents/sidur-hoshava-2026-09.pdf).
// Men's section only -- the women's section floor plan has no assigned seat numbers.
//
// Surnames are truncated to the shortest prefix that's still unique among this
// list (+ ׳), directly in this source file rather than only at render time --
// the repo is public, so anyone can open this file on GitHub, and a display-only
// truncation wouldn't protect against that. Compound surnames with an internal
// space (בן דוד, בן סעדון, בן שאול, הרב חסאן) and single-word entries (לימואי)
// are left untouched -- truncating them cleanly isn't compatible with the
// whitespace-tokenized search below. The search in seating.astro matches a
// typed surname against its own truncated prefix, so searching a full correct
// name still finds the right seat.
export interface SeatingEntry {
	name: string;
	seats: string[];
}

export const MENS_SEATING: SeatingEntry[] = [
	{ name: "אברה׳ אלי", seats: ["67", "68"] },
	{ name: "אברמ׳ ארקדי", seats: ["32", "33", "34", "35"] },
	{ name: "אל׳ דן", seats: ["81", "82", "83"] },
	{ name: "אמ׳ יוסי", seats: ["48", "49"] },
	{ name: "אר׳ פיני", seats: ["69", "70"] },
	{ name: "בוטו׳ אילן", seats: ["28", "29"] },
	{ name: "בוטס׳ דוד", seats: ["51", "52", "53"] },
	{ name: "בט׳ שאול", seats: ["166", "167", "168"] },
	{ name: "בי׳ צדוק", seats: ["92", "93"] },
	{ name: "בכ׳ ישראל", seats: ["156"] },
	{ name: "בן דוד סיימון", seats: ["30", "31", "40"] },
	{ name: "בן סעדון אופיר", seats: ["147", "148", "149", "150", "169"] },
	{ name: "בן סעדון רמי", seats: ["116"] },
	{ name: "בן שאול יחיאל", seats: ["99", "100", "101"] },
	{ name: "ברד׳ משה בראל", seats: ["50"] },
	{ name: "ברמ׳ דרור", seats: ["44", "45", "46"] },
	{ name: "גא׳ ניר הכהן", seats: ["130", "131"] },
	{ name: "גי׳ בדש", seats: ["25"] },
	{ name: "גפ׳ חנן ניסים", seats: ["97", "98"] },
	{ name: "דו׳ יעקב הכהן", seats: ["54", "55", "56"] },
	{ name: "דו׳ ניר", seats: ["112", "113", "114", "115"] },
	{ name: "דיא׳ יצחק", seats: ["47"] },
	{ name: "דיי׳ מיטשל יצחק", seats: ["19", "20", "21"] },
	{ name: "דר׳ רותם", seats: ["142", "143", "144", "145", "146"] },
	{ name: "הרב חסאן בנימין", seats: ["13"] },
	{ name: "זה׳ יצחק", seats: ["11"] },
	{ name: "חב׳ יחזקאל", seats: ["121"] },
	{ name: "טוו׳ יגאל", seats: ["74", "75"] },
	{ name: "טומ׳ שי", seats: ["102", "103"] },
	{ name: "טי׳ רונן", seats: ["151", "152", "153"] },
	{ name: "טר׳ יואב", seats: ["94", "95"] },
	{ name: "יעקב אוזן", seats: ["107"] },
	{ name: "יעקו׳ דניאל", seats: ["41", "42", "43"] },
	{ name: "יצ׳ שי", seats: ["132", "137", "138", "139", "140", "141"] },
	{ name: "כה׳ בנג'י", seats: ["3", "4"] },
	{ name: "כה׳ גדי רחמים", seats: ["125", "126"] },
	{ name: "כנ׳ תומר", seats: ["16", "17", "18"] },
	{ name: "לו׳ יהונתן", seats: ["65", "66"] },
	{ name: "לימואי", seats: ["14", "15"] },
	{ name: "מה׳ ארז", seats: ["104", "105", "106"] },
	{ name: "מו׳ אריה", seats: ["23", "24"] },
	{ name: "מז׳ משה", seats: ["127", "128", "129"] },
	{ name: "מז׳ שרון", seats: ["133", "134", "135", "136"] },
	{ name: "מל׳ יגאל", seats: ["117", "118", "119", "120"] },
	{ name: "מנ׳ זאב", seats: ["57", "58"] },
	{ name: "מק׳ רוני", seats: ["164", "165"] },
	{ name: "מר׳ וינשטיין", seats: ["1", "2"] },
	{ name: "נגו׳ חנוך", seats: ["89"] },
	{ name: "נגר זיו", seats: ["84", "85", "86", "87", "88"] },
	{ name: "סט׳ סטנטון", seats: ["91"] },
	{ name: "סט׳ שימי", seats: ["90"] },
	{ name: "סל׳ טל", seats: ["37"] },
	{ name: "סמ׳ ג'ק", seats: ["12"] },
	{ name: "סר׳ אורן", seats: ["38", "39"] },
	{ name: "סת׳ משה", seats: ["22"] },
	{ name: "עו׳ רן", seats: ["71", "72", "73"] },
	{ name: "עזי׳ דניאל", seats: ["76", "77", "78"] },
	{ name: "עזר׳ ישראל", seats: ["160", "161", "162"] },
	{ name: "ער׳ זוהר", seats: ["122", "123", "124"] },
	{ name: "פי׳ יאיר", seats: ["108", "109", "110", "111"] },
	{ name: "פל׳ ניסים", seats: ["36"] },
	{ name: "קא׳ יצחק", seats: ["96"] },
	{ name: "קו׳ מוטי", seats: ["5", "6", "7", "8"] },
	{ name: "רע׳ יהונתן", seats: ["61", "62", "63"] },
	{ name: "רש׳ קובי", seats: ["79", "80"] },
	{ name: "שו׳ ינון", seats: ["154", "155", "157", "158", "159"] },
	{ name: "שט׳ יגאל", seats: ["15.5", "26", "27"] },
	{ name: "שש׳ אבי", seats: ["59", "60"] },
	{ name: "תו׳ פרץ", seats: ["9", "10"] },
];

export const VACANT_SEATS = ["64", "163"];
