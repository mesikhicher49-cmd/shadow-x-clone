// pages/api/index.js
export default async function handler(req, res) {
  const { type = "mobile", term = "7676162652" } = req.query;

  // NEW PHP API URL
  const url = `https://devlyn.cloud/num.php/?num=${term}`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    const data = await r.json();

    // Add credit field
    const credit = process.env.CREDIT_USERNAME || "@MessiTrace_Networks";
    data.credit = credit;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error while fetching number info",
    });
  }
}
