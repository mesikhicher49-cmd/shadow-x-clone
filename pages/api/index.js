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

    // 🔗 NEW API
    const apiUrl = `https://num-2-info.gamer.gd/info.php?key=17_DAY_TRIAL&number=${encodeURIComponent(mobile)}`;

    // 📡 Fetch data
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    // ❌ Handle API error
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Upstream API error",
      });
    }

    let data;

    // 🔥 FIX: JSON + TEXT fallback
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();

      return res.status(200).json({
        success: true,
        raw: text,
        note: "API not returning JSON",
      });
    }

    // ❌ Remove unwanted fields
    const removeFields = [
      "warning",
      "status",
      "code",
      "searched_number",
      "response_time",
      "source_used",
      "mode",
      "count",
      "Owner",
      "owner",
      "API BY",
      "channel",
      "validity",
      "developer",
      "credit",
      "brand",
      "branding",
      "processed_by",
      "owner_contact",
    ];

    removeFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        delete data[field];
      }
    });

    // ✅ Final response
    return res.status(200).json({
      success: true,
      ...data,
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
}    try {
      data = await response.json();
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON response",
      });
    }

    // ❌ Remove unwanted fields
    const removeFields = [
      "warning",
      "status",
      "code",
      "searched_number",
      "response_time",
      "source_used",
      "mode",
      "count",
      "Owner",
      "owner",
      "API BY",
      "channel",
      "validity",
      "developer",
      "credit",
      "brand",
      "branding",
      "processed_by",
      "owner_contact",
    ];

    removeFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        delete data[field];
      }
    });

    // ✅ Final response
    return res.status(200).json({
      success: true,
      ...data,
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
