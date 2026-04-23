// pages/api/index.js

export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    // ❌ Validate input
    if (!mobile || mobile.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number required",
      });
    }

    // 🔗 API URL
    const apiUrl = `https://num-2-info.gamer.gd/info.php?key=17_DAY_TRIAL&number=${encodeURIComponent(mobile)}`;

    // 📡 Fetch
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    // ❌ Upstream error
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Upstream API error",
      });
    }

    let data;

    // 🔥 JSON + fallback
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();

      return res.status(200).json({
        success: false,
        message: "API did not return JSON",
        raw: text,
      });
    }

    // 📦 Extract main result
    const user = data?.result?.results?.[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    // ✅ Final clean response
    return res.status(200).json({
      success: true,
      name: user.NAME || null,
      father_name: user.fname || null,
      address: user.ADDRESS || null,
      mobile: user.MOBILE || null,
      circle: user.circle || null,
      id: user.id || null,
      email: user.email || null,
      alt: user.alt || null,

      owner: "ZYRO PAPA",
      api_by: "@ZyroX9",
      channel: "@ZyroXZone",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
