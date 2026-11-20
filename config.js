// クライアントキーだけを返す（シークレットキーは返さない）
module.exports = (req, res) => {
  const clientKey = process.env.TOSS_CLIENT_KEY || "";
  if (!clientKey) return res.status(500).json({ message: "TOSS_CLIENT_KEY が未設定です" });
  res.status(200).json({ clientKey, testMode: clientKey.startsWith("test_") });
};
