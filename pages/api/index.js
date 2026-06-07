export default async function handler(req, res) {
  try {
    const mobile = req.query.mobile;

    if (!mobile || mobile.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number required",
      });
    }

    // New API
    const apiUrl = `https://api-master-flame.vercel.app/search?query=${encodeURIComponent(mobile)}`;

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

    const data = await response.json();

    // Remove unwanted fields
    delete data.credit;
    delete data.channel;
    delete data.api_valid_until;
    delete data.days_remaining;

    // Add your branding
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
