// pages/api/index.js
export default async function handler(req, res) {
  try {
    // Accept original parameters used in PHP
    const mobile = req.query.mobile;
    const key = req.query.key;

    if (!mobile || !key) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters: mobile & key are required",
      });
    }

    // Upstream NUM API
    const upstreamUrl = `https://numapi.anshapi.workers.dev/?num=${encodeURIComponent(
      mobile
    )}`;

    const r = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const text = await r.text();

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({
        success: false,
        message: "Upstream returned invalid JSON",
        preview: text.slice(0, 300),
      });
    }

    // Remove original credits
    delete payload.developer;
    delete payload.credit;
    delete payload.brand;

    // Add your credit
    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    // Return final JSON
    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
