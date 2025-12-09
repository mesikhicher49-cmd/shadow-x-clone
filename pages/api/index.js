# replace the file exactly (POSIX / Linux / macOS / WSL)
cat > pages/api/index.js <<'EOF'
// pages/api/index.js
export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);

    // forward query params (number, api_key, etc.)
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      else upstreamUrl.searchParams.append(k, v);
    });

    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
    });

    const html = await r.text();

    // extract first {...} block from HTML
    const match = html.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({
        success: false,
        message: "No JSON found in upstream response",
        upstreamStatus: r.status,
        preview: html.slice(0, 300),
      });
    }

    let payload;
    try {
      payload = JSON.parse(match[0]);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: "JSON extract parse error",
        upstreamStatus: r.status,
        preview: match[0].slice(0, 300),
      });
    }

    // remove unwanted keys
    [
      "developer",
      "credit",
      "brand",
      "developer_message",
      "developer_tag",
      "powered_by",
      "credit_by",
    ].forEach((k) => delete payload[k]);

    // add your credits
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
EOF
