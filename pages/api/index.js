// pages/api/index.js
export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Missing parameter: mobile is required",
      });
    }

    // ✅ Hardcoded API (key hidden)
    const upstreamUrl = `https://yash-code-with-ai.alphamovies.workers.dev/?num=${encodeURIComponent(mobile)}&key=7189814021`;

    const r = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await r.json();

    // ❌ Remove all credits
    const removeFields = [
      "developer",
      "credit",
      "brand",
      "branding",
      "processed_by",
      "owner_contact"
    ];

    removeFields.forEach(field => delete data[field]);

    // ✅ Apna credit add
    data["API BY"] = "@ZyroXZone";
    data.Owner = "@ZyroX9";

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
