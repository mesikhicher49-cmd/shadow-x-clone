// pages/api/index.js

export default async function handler(req, res) {
  // Upstream main API
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    // 🔹 Pehla request (jo abhi HTML + JS de raha hai)
    const firstUrl = new URL(REMOTE_BASE);

    // number, api_key, etc. forward karo
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => firstUrl.searchParams.append(k, val));
      } else {
        firstUrl.searchParams.append(k, v);
      }
    });

    const firstRes = await fetch(firstUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
    });

    const firstText = await firstRes.text();

    let payload = null;

    // 🔸 Try: direct JSON hai kya?
    try {
      payload = JSON.parse(firstText);
    } catch (e) {
      payload = null;
    }

    // Agar direct JSON nahi mila, to HTML/JS me se redirect URL nikaalo
    if (!payload) {
      const redirectMatch = firstText.match(/location\.href="([^"]+)"/);

      if (!redirectMatch) {
        // Koi redirect URL bhi nahi mila
        return res.status(502).json({
          success: false,
          message: "Upstream returned HTML/JS without JSON",
          upstreamStatus: firstRes.status,
          preview: firstText.slice(0, 300),
        });
      }

      const redirectUrl = redirectMatch[1];

      // 🔹 Second request: jo actual JSON dena chahiye
      const secondRes = await fetch(redirectUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json, text/plain, */*",
        },
      });

      const secondText = await secondRes.text();

      try {
        payload = JSON.parse(secondText);
      } catch (e) {
        return res.status(502).json({
          success: false,
          message:
            "Upstream did not return valid JSON even after redirect",
          upstreamStatus: secondRes.status,
          preview: secondText.slice(0, 300),
        });
      }
    }

    // ❌ Unwanted credits hatao
    [
      "developer",
      "credit",
      "brand",
      "developer_message",
      "developer_tag",
      "powered_by",
      "credit_by",
    ].forEach((k) => {
      if (k in payload) delete payload[k];
    });

    // ✅ Apne credits daalo
    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
