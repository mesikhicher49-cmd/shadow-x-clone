// pages/api/clone.js
export default async function handler(req, res) {
  // Base upstream (default तुम्हारे दिए URL पर रखा है)
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://raspy-glitter-2fbb.sharmar65195.workers.dev/";

  try {
    // Build upstream URL and copy all incoming query params
    const upstreamUrl = new URL(REMOTE_BASE);
    // Copy query params from incoming request
    Object.entries(req.query || {}).forEach(([k, v]) => {
      // if v is array (multiple params), append each
      if (Array.isArray(v)) v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      else upstreamUrl.searchParams.append(k, v);
    });

    // Fetch from upstream
    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/plain, */*",
      },
      // optional: increase timeout externally if needed
    });

    const text = await r.text();

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (parseErr) {
      // Upstream didn't return valid JSON — return helpful debug info
      return res.status(502).json({
        success: false,
        message: "Upstream did not return valid JSON",
        upstreamStatus: r.status,
        upstreamTextPreview:
          typeof text === "string" ? text.slice(0, 2000) : String(text),
      });
    }

    // Override / add developer fields (from env or defaults)
    const developerMessage = process.env.CREDIT_USERNAME || "@MessiTrace_Networks";
    const developerTag = process.env.CREDIT_TAG || "Api By R.K";

    // If upstream returns object, set/overwrite the fields
    if (typeof payload === "object" && payload !== null) {
      payload.developer_message = developerMessage;
      payload.developer_tag = developerTag;

      // Optional: add info about the clone/origin
      payload._proxied_from = upstreamUrl.origin;
      payload._proxied_url = upstreamUrl.pathname + upstreamUrl.search;
    }

    // Return status same as upstream (or 200)
    const statusToReturn = r.status >= 200 && r.status < 600 ? r.status : 200;
    res.status(statusToReturn).json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error while proxying upstream API",
    });
  }
}
