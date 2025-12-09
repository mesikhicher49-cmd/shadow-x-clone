// pages/api/index.js

export default async function handler(req, res) {
  // NEW API SET HERE ↓
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    // Build URL with ?number=
    const upstreamUrl = new URL(REMOTE_BASE);

    // Pass all query params (number included)
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      } else {
        upstreamUrl.searchParams.append(k, v);
      }
    });

    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/plain, */*",
      },
    });

    const text = await r.text();

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: "Upstream returned invalid JSON",
        upstreamStatus: r.status,
        preview: text.slice(0, 2000),
      });
    }

    // ❌ Remove Reflex InfoX credit tags
    delete payload.developer;    // REFLEX InfoX
    delete payload.credit;       // InfoX

    // ❌ Extra unwanted (safe side)
    delete payload.brand;
    delete payload.developer_message;
    delete payload.developer_tag;
    delete payload.powered_by;
    delete payload.credit_by;

    // ✅ Add your own credits
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
