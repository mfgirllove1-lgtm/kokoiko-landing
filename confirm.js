const { PRODUCTS, unitPrice } = require("./_products");

// 金額をサーバーの価格表と照合してから、トスに承認を依頼する
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const { paymentKey, orderId } = body;
  const amount = Number(body.amount);
  if (!paymentKey || !orderId) return res.status(400).json({ code: "BAD_REQUEST", message: "パラメータが不足しています" });

  const m = /^KK_(jd|gn|dy)_(\d{1,2})_[a-z0-9]+_[a-f0-9]+$/.exec(orderId);
  if (!m) return res.status(400).json({ code: "INVALID_ORDER", message: "注文番号が正しくありません" });
  const expected = unitPrice(PRODUCTS[m[1]]) * parseInt(m[2], 10);
  if (amount !== expected) {
    return res.status(400).json({ code: "AMOUNT_MISMATCH", message: "金額が一致しないため、承認できません" });
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ code: "NO_KEY", message: "TOSS_SECRET_KEY が未設定です" });
  const auth = "Basic " + Buffer.from(secretKey + ":").toString("base64"); // 末尾のコロンが必須

  try {
    const r = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: expected }), // ブラウザの値ではなくサーバーの金額
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ code: data.code, message: data.message });
    res.status(200).json({ orderId: data.orderId, totalAmount: data.totalAmount, currency: data.currency || "KRW", method: data.method, approvedAt: data.approvedAt });
  } catch (e) {
    res.status(502).json({ code: "NETWORK_ERROR", message: "決済サーバーに接続できませんでした" });
  }
};
