// pages/api/index.js

export default async function handler(req, res) {
  // Upstream API base
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    // URL banao
    const upstreamUrl = new URL(REMOTE_BASE);

    // Sare query params (number, api_key, etc.) forward karo
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => upstreamUrl.searchParams.append(k, val));
      } else {
        upstreamUrl.searchParams.append(k, v);
      }
    });

    // Upstream ko call
    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
    });

    const html = await r.text();

    // HTML ke andar se { ... } wala JSON nikaalne ki koshish
    const match = html.match(/\{[\s\S]*\}/);

    if (!match) {
      // Agar JSON mila hi nahi
      return res.status(502).json({
        success: false,
        message: "No JSON found in upstream response",
        upstreamStatus: r.status,
        preview: html.slice(0, 300),
      });
    }

    let payload;

    try {
      // Jo { ... } mila usko parse karo
      payload = JSON.parse(match[0]);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: "JSON extract parse error",
        upstreamStatus: r.status,
        preview: match[0].slice(0, 300),
      });
    }

    // Reflex InfoX ke credits hatao
    delete payload.developer;
    delete payload.credit;
    delete payload.brand;
    delete payload.developer_message;
    delete payload.developer_tag;
    delete payload.powered_by;
    delete payload.credit_by;

    // Apne credits daalo
    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    // Final response
    return res.status(200).json(payload);
  } catch (err) {
    // Server error
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
