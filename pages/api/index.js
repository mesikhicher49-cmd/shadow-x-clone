// pages/api/index.js
export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://raspy-glitter-2fbb.sharmar65195.workers.dev/";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);
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
    } catch (parseErr) {
      return res.status(502).json({
        success: false,
        message: "Upstream did not return valid JSON",
        upstreamStatus: r.status,
        upstreamTextPreview:
          typeof text === "string" ? text.slice(0, 2000) : String(text),
      });
    }

    // ❌ Remove unwanted developer names from upstream
    delete payload.developer;
    delete payload.brand;

    // ✅ Add your developer credit
    const developerMessage = process.env.CREDIT_USERNAME || "@MessiTrace_Networks";
    const developerTag = process.env.CREDIT_TAG || "Api By R.K";

    payload.developer_message = developerMessage;
    payload.developer_tag = developerTag;

    const statusToReturn = r.status >= 200 && r.status < 600 ? r.status : 200;
    return res.status(statusToReturn).json(payload);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error while proxying upstream API",
    });
  }
}    const developerTag = process.env.CREDIT_TAG || "Api By R.K";

    if (typeof payload === "object" && payload !== null) {
      payload.developer_message = developerMessage;
      payload.developer_tag = developerTag;
      // metadata removed on purpose
    }

    const statusToReturn = r.status >= 200 && r.status < 600 ? r.status : 200;
    return res.status(statusToReturn).json(payload);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error while proxying upstream API",
    });
  }
}
