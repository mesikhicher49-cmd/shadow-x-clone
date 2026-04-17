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

    // ✅ API 1 (Primary)
    const api1 = `https://all-in-one-api-hub.onrender.com/num?key=Z4X-58E1I43X-Silent&number=${encodeURIComponent(mobile)}`;

    // ✅ API 2 (Backup)
    const api2 = `https://shadow-num-info.babuvikram614.workers.dev/?num=${encodeURIComponent(mobile)}&key=Darkaura`;

    let data;

    // 🔹 Try Primary API
    try {
      const r1 = await fetch(api1, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      });

      data = await r1.json();

      // ❗ Agar API1 ka data invalid ho
      if (!data || data.success === false) {
        throw new Error("Primary API failed");
      }

    } catch (err) {
      // 🔁 Fallback to API2
      try {
        const r2 = await fetch(api2, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        });

        data = await r2.json();

      } catch (err2) {
        return res.status(500).json({
          success: false,
          message: "Both APIs failed",
        });
      }
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
}      "credit",
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
