// pages/api/index.js
export default async function handler(req, res) {
  try {
    // Accept either ?num= or ?number= from the caller
    const num = req.query.num || req.query.number;
    if (!num) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: num (or number)",
        usage: "/api?num=9050402042",
      });
    }

    // Upstream base
    const REMOTE_BASE = "https://numapi.anshapi.workers.dev/";

    // Build upstream URL with required param name 'num'
    const upstreamUrl = new URL(REMOTE_BASE);
    upstreamUrl.searchParams.append("num", num);

    // Forward any other query params optionally (like country, etc.)
    // but avoid duplicating num
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (k === "num" || k === "number") return;
      if (Array.isArray(v)) v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      else upstreamUrl.searchParams.append(k, v);
    });

    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/plain, */*",
      },
    });

    // Upstream error handling
    const text = await r.text();
    if (!r.ok) {
      return res.status(502).json({
        success: false,
        message: "Upstream returned error",
        upstreamStatus: r.status,
        preview: text.slice(0, 800),
      });
    }

    // Try parse JSON
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: "Upstream returned invalid JSON",
        preview: text.slice(0, 800),
      });
    }

    // Remove any upstream credits and add yours
    [
      "developer",
      "developer_name",
      "dev",
      "credit",
      "brand",
      "powered_by",
      "made_by",
    ].forEach((k) => delete payload[k]);

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
