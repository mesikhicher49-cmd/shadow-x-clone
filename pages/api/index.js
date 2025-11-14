// pages/api/index.js
export default async function handler(req, res) {
  const { type = "mobile", term = "7676162652" } = req.query;
  const url = `https://shadow-x-osint.vercel.app/api?key=Shadow&type=${type}&term=${term}`;

  try {
    // Use built-in fetch (available on Vercel / Node 18+)
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    const data = await r.json();

    const credit = process.env.CREDIT_USERNAME || "@MessiTrace_Networks";
    data.credit = credit;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
