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

    // ✅ New API added
    const upstreamUrl = `https://shadow-num-info.babuvikram614.workers.dev/?num=${encodeURIComponent(mobile)}&key=Darkaura`;

    const r = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    // ❗ Agar response JSON na ho to error handle
    let data;
    try {
      data = await r.json();
    } catch {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON response from upstream API",
      });
    }

    // ❌ Unwanted fields remove
    const removeFields = [
      "developer",
      "credit",
      "brand",
      "branding",
      "processed_by",
      "owner_contact"
    ];

    removeFields.forEach(field => {
      if (data[field]) delete data[field];
    });

    // ✅ Apna credit add
    data["API BY"] = "@ZyroXZone";
    data["Owner"] = "@ZyroX9";

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
