// 画面表示用データ（金額の正はサーバーの api/_products.js）
window.KOKOIKO = {
  // 円換算の目安レート: 100円 = 870ウォン（2026-11-20時点の目安。更新はこの1行のみ）
  rate: { krwPer100Jpy: 870, asOf: "2026年11月20日" },
  minPeople: 10,
  // 予約受付は出発日の4日前まで（出発3日前に催行可否を確定するため）
  bookingLeadDays: 4,
  // 韓国の祝日（運休）
  holidays: ["2026-12-25","2027-01-01","2027-02-06","2027-02-07","2027-02-08","2027-02-09","2027-03-01"],
  products: {
    "jeonju-damyang": { name: "韓屋と竹林にときめく韓国旅 ～全州・潭陽～", short: "全州・潭陽", krw: 100000, page: "jeonju-damyang.html" },
    "gangneung": { name: "ソウルから出発！大関嶺の山と江陵の海を巡る旅", short: "江陵", krw: 90000, page: "gangneung.html" },
    "danyang": { name: "韓国の絶景・癒しの旅 ～丹陽～", short: "丹陽", krw: 90000, page: "danyang.html" }
  }
};
window.KOKOIKO.yen = function (krw) {
  var y = krw / (window.KOKOIKO.rate.krwPer100Jpy / 100);
  return Math.round(y / 100) * 100;
};
window.KOKOIKO.fmtYen = function (n) { return "¥" + n.toLocaleString("ja-JP"); };
window.KOKOIKO.fmtKrw = function (n) { return "₩" + n.toLocaleString("ja-JP"); };
window.KOKOIKO.fmtDate = function (iso) {
  var p = iso.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
  return p[0] + "年" + (+p[1]) + "月" + (+p[2]) + "日(" + "日月火水木金土"[d.getDay()] + ")";
};
// デモ用の予約人数（本番では予約データに置き換え）
window.KOKOIKO.demoBooked = function (productId, iso) {
  var s = 0, k = productId + iso;
  for (var i = 0; i < k.length; i++) s = (s * 31 + k.charCodeAt(i)) % 9973;
  return s % 13;
};
// 表示ルール: 5名未満=募集中 / 5〜9名=あと○名 / 10名以上=出発確定
window.KOKOIKO.statusOf = function (booked) {
  var min = window.KOKOIKO.minPeople;
  if (booked >= min) return { cls: "ok", short: "出発確定", text: "出発確定・予約受付中です。" };
  if (booked >= 5) return { cls: "near", short: "あと" + (min - booked) + "名", text: "あと" + (min - booked) + "名で出発確定です。" };
  return { cls: "", short: "募集中", text: "募集中です（最少催行人数10名）。" };
};
