// pages/api/index.js

export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    if (!mobile || mobile.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number required",
      });
    }

    const apiUrl = `https://num-2-info.gamer.gd/info.php?key=17_DAY_TRIAL&number=${encodeURIComponent(mobile)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Upstream API error",
      });
    }

    // 🔥 ONLY READ BODY ONCE
    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        success: false,
        message: "Invalid JSON from API",
        raw: text,
      });
    }

    // ❌ Remove unwanted fields
    delete data.developer;
    delete data.status;
    delete data.credit;

    if (data.result) {
      delete data.result.count;
    }

    // ✅ Add your branding
    data.owner = "ZYRO PAPA";
    data.api_by = "@ZyroX9";
    data.channel = "@ZyroXZone";

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
