// 画面表示用データ（金額の正はサーバーの api/_products.js）
window.KOKOIKO = {
  // 円換算の目安レート。表示時に /api/rate から当日のレートを取得し、取得できない場合はこの値を使う
  rate: { krwPer100Jpy: 870, asOf: "2026年11月20日", live: false },
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

// 当日レートの取得（3秒で打ち切り、失敗時は既定値のまま）
window.KOKOIKO.rateReady = (function () {
  var K = window.KOKOIKO;
  var timeout = new Promise(function (r) { setTimeout(r, 3000); });
  var load = fetch("/api/rate").then(function (r) { return r.json(); }).then(function (d) {
    if (d && d.krwPer100Jpy > 500 && d.krwPer100Jpy < 1500 && d.source !== "fallback") {
      var p = String(d.asOf).split("-");
      K.rate = { krwPer100Jpy: d.krwPer100Jpy, asOf: p[0] + "年" + (+p[1]) + "月" + (+p[2]) + "日", live: true };
    }
  }).catch(function () {});
  return Promise.race([load, timeout]).then(function () { return K.rate; });
})();
window.KOKOIKO.rateText = function () {
  var r = window.KOKOIKO.rate;
  return "円表示は" + r.asOf + "のレート（100円＝" + r.krwPer100Jpy.toLocaleString("ja-JP") + "ウォン）で換算した目安で、お支払い金額（ウォン）は決済画面で確定します。";
};
// 円表示の更新：すぐに一度、当日レート取得後にもう一度実行
window.KOKOIKO.onRate = function (fn) {
  var K = window.KOKOIKO;
  function apply() {
    document.querySelectorAll("[data-yen]").forEach(function (e) { e.textContent = "約" + K.fmtYen(K.yen(+e.dataset.yen)); });
    function sum(l) { return l.split(",").reduce(function (a, v) { return a + K.yen(+v); }, 0); }
    document.querySelectorAll("[data-yensum]").forEach(function (e) { e.textContent = "約" + K.fmtYen(sum(e.dataset.yensum)); });
    document.querySelectorAll("[data-yendiff]").forEach(function (e) { var x = e.dataset.yendiff.split("|"); e.textContent = "約" + K.fmtYen(K.yen(+x[0]) - sum(x[1])); });
    document.querySelectorAll(".rate-note").forEach(function (e) { e.textContent = K.rateText(); });
    if (fn) fn();
  }
  apply(); K.rateReady.then(apply);
};
