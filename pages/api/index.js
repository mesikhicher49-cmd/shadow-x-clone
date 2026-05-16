export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    if (!mobile || mobile.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number required",
      });
    }

    // 🔗 NEW API
    const apiUrl = `https://support-toxic.vercel.app/?mobile=${encodeURIComponent(mobile)}`;

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

    // ✅ Parse JSON
    const data = await response.json();

    // ❌ Remove unwanted fields
    delete data.credit;
    delete data.channel;
    delete data.api;
    delete data.source;
    delete data.days_remaining;
    delete data.developer;
    delete data.owner;

    // ✅ Add your branding only
    data.owner = "ZYRO PAPA";
    data.api_by = "@ZyroX9";
    data.channel = "@ZyroXZone";

    // ✅ Return final response
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
