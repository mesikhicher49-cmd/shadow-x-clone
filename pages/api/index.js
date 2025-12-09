export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);

    // Pass all query params
    Object.entries(req.query || {}).forEach(([k, v]) => {
      upstreamUrl.searchParams.append(k, v);
    });

    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
    });

    const html = await r.text();

    // 🟢 Extract JSON using regex
    const match = html.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({
        success: false,
        message: "No JSON found in upstream response",
        preview: html.slice(0, 300),
      });
    }

    let payload = {};
    try {
      payload = JSON.parse(match[0]);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: "JSON extract parse error",
        preview: match[0].slice(0, 300),
      });
    }

    // ❌ Remove Reflex InfoX credits
    delete payload.developer;
    delete payload.credit;

    // ❌ Extra protection
    delete payload.brand;
    delete payload.developer_tag;
    delete payload.powered_by;
    delete payload.credit_by;

    // ✅ Add your credits
    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    return res.status(200).json(payload);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
}  }
}
