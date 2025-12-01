// pages/api/index.js
export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://splexxo-bhai.vercel.app/api/seller";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);

    // Pass query params to upstream
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      else upstreamUrl.searchParams.append(k, v);
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

    // ❌ Remove any developer/credit info upstream sends
    delete payload.developer;
    delete payload.brand;
    delete payload.developer_message;
    delete payload.developer_tag;
    delete payload.credit_by;      // 👈 yeh new hai
    delete payload.powered_by;     // 👈 yeh new hai

    // ✅ Add ONLY your credits (Final)
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
