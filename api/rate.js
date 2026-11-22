// 当日の為替レート（円→ウォン）を返す。取得できない場合は既定値を返す。
// 表示用の目安。決済金額（ウォン）は api/_products.js の価格で確定する。
const FALLBACK = { krwPer100Jpy: 870, asOf: "2026-11-20", source: "fallback" };

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch("https://open.er-api.com/v6/latest/JPY", { signal: ctrl.signal });
    clearTimeout(t);
    const d = await r.json();
    const krw = d && d.rates && d.rates.KRW;
    if (d.result !== "success" || !(krw > 5 && krw < 15)) throw new Error("bad rate");
    const asOf = new Date(d.time_last_update_unix * 1000)
      .toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }); // YYYY-MM-DD
    res.status(200).json({ krwPer100Jpy: Math.round(krw * 1000) / 10, asOf, source: "ExchangeRate-API" });
  } catch (e) {
    res.status(200).json(FALLBACK);
  }
};
