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

    // ✅ Your API
    const upstreamUrl = `https://all-in-one-api-hub.onrender.com/num?key=Z4X-58E1I43X-Silent&number=${encodeURIComponent(mobile)}`;

    const r = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    let data;
    try {
      data = await r.json();
    } catch {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON response from upstream API",
      });
    }

    // ❌ Remove unwanted fields
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

    // ✅ Replace owner
    data["owner"] = "ZYRO PAPA";

    // ✅ Add your credit
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
