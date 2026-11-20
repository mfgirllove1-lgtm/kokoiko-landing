const crypto = require("crypto");
const { BY_ID, MAX_PEOPLE, CURRENCY, unitPrice } = require("./_products");

// 商品IDと人数だけを受け取り、金額と orderId はサーバーが決める
module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const product = BY_ID[body.productId];
  const people = parseInt(body.people, 10);
  if (!product) return res.status(400).json({ message: "商品が見つかりません" });
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) {
    return res.status(400).json({ message: "人数が正しくありません" });
  }
  const unit = unitPrice(product);
  if (!unit) return res.status(500).json({ message: "この通貨の価格が未設定です" });
  // orderId: 英数字と - _ = のみ、6〜64文字
  const rand = crypto.randomBytes(6).toString("hex");
  const orderId = `KK_${product.code}_${people}_${Date.now().toString(36)}_${rand}`;
  res.status(200).json({
    orderId,
    amount: unit * people,
    currency: CURRENCY,
    orderName: `${product.name}（${people}名）`,
  });
};
