export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    if (!mobile || mobile.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number required",
      });
    }

    // 🔗 YOUR WORKING API
    const apiUrl = `https://shadow-num-info.babuvikram614.workers.dev/?num=${encodeURIComponent(mobile)}&key=Darkaura`;

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

    // ✅ Direct JSON parse (ye wali API JSON deti hai)
    const data = await response.json();

    // ❌ Remove unwanted fields (optional)
    delete data.developer;
    delete data.credit;
    delete data.owner;

    // ✅ Add your branding
    data.owner = "ZYRO PAPA";
    data.api_by = "@ZyroX9";
    data.channel = "@ZyroXZone";

    // ✅ SAME response return
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
