// サーバー側の価格表（金額の正）。ブラウザから来た金額は信用しない。
// priceJpy: 円建て決済（トス多通貨決済の契約後）に使う固定価格。クライアントが決めたら入力する。
const PRODUCTS = {
  jd: { id: "jeonju-damyang", name: "全州・潭陽 日帰りバスツアー", price: 100000, priceJpy: null },
  gn: { id: "gangneung", name: "江陵 日帰りバスツアー", price: 90000, priceJpy: null },
  dy: { id: "danyang", name: "丹陽 日帰りバスツアー", price: 90000, priceJpy: null },
};
// 決済通貨: 既定は KRW。円建て決済の契約後に環境変数 PAY_CURRENCY=JPY に切り替える。
const CURRENCY = process.env.PAY_CURRENCY === "JPY" ? "JPY" : "KRW";
function unitPrice(p) {
  return CURRENCY === "JPY" ? p.priceJpy : p.price;
}
const BY_ID = Object.fromEntries(Object.entries(PRODUCTS).map(([code, p]) => [p.id, { ...p, code }]));
const MAX_PEOPLE = 20;
module.exports = { PRODUCTS, BY_ID, MAX_PEOPLE, CURRENCY, unitPrice };
