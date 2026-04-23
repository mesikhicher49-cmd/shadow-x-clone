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

    let data;

    // 🔥 Safe parse (JSON + fallback)
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      return res.status(200).json({
        success: false,
        message: "Invalid API response",
        raw: text,
      });
    }

    // ❌ Remove unwanted fields (top level)
    delete data.developer;
    delete data.status;
    delete data.credit;
    delete data.owner;
    delete data.channel;

    // ❌ Remove unwanted fields inside result
    if (data.result) {
      delete data.result.count;
    }

    // ✅ Add your branding
    data.owner = "ZYRO PAPA";
    data.api_by = "@ZyroX9";
    data.channel = "@ZyroXZone";

    // ✅ Send SAME structure response
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // 👈 ye add kiya debug ke liye
    });
  }
}
