// pages/api/index.js
// DEBUG VERSION - replace your file with this, deploy and paste the JSON output here

export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  const debug = {
    handler_version: "debug-v3",
    time: new Date().toISOString(),
    received_query: req.query || {},
  };

  try {
    // Build first URL
    const firstUrl = new URL(REMOTE_BASE);
    Object.entries(req.query || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((val) => firstUrl.searchParams.append(k, val));
      else firstUrl.searchParams.append(k, v);
    });
    debug.firstUrl = firstUrl.toString();

    // First fetch
    const firstRes = await fetch(firstUrl.toString(), {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
    });
    const firstText = await firstRes.text();
    debug.firstStatus = firstRes.status;
    debug.firstPreview = firstText.slice(0, 1200); // preview only

    // Try direct JSON parse
    let payload = null;
    try {
      payload = JSON.parse(firstText);
      debug.parsedDirect = true;
    } catch (e) {
      debug.parsedDirect = false;
    }

    // If not JSON, try to find redirect URL (location.href or location.replace)
    let redirectUrl = null;
    if (!payload) {
      const m1 = firstText.match(/location\.href\s*=\s*"([^"]+)"/);
      const m2 = firstText.match(/location\.replace\(\s*"([^"]+)"\s*\)/);
      const m3 = firstText.match(/window\.location\s*=\s*"([^"]+)"/);
      redirectUrl = (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1]) || null;
      debug.redirectUrl = redirectUrl;
    }

    // If we have a redirect URL, call it
    if (!payload && redirectUrl) {
      const secondRes = await fetch(redirectUrl, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json, text/plain, */*" },
      });
      const secondText = await secondRes.text();
      debug.secondStatus = secondRes.status;
      debug.secondPreview = secondText.slice(0, 1200);

      try {
        payload = JSON.parse(secondText);
        debug.parsedSecond = true;
      } catch (e) {
        debug.parsedSecond = false;
        debug.parseErrorSecond = (e && e.message) || String(e);
      }
    }

    // If still no payload, try to extract JSON-like {...} inside firstText
    if (!payload) {
      const match = firstText.match(/\{[\s\S]*\}/);
      if (match) {
        debug.foundJsonLike = true;
        debug.jsonLikePreview = match[0].slice(0, 1200);
        try {
          payload = JSON.parse(match[0]);
          debug.parsedJsonLike = true;
        } catch (e) {
          debug.parsedJsonLike = false;
          debug.parseErrorJsonLike = (e && e.message) || String(e);
        }
      } else {
        debug.foundJsonLike = false;
      }
    }

    // Final status if still no payload
    if (!payload) {
      return res.status(502).json({
        success: false,
        message: "DEBUG: upstream did not provide parseable JSON",
        debug,
      });
    }

    // Remove unwanted keys and add your credits
    [
      "developer",
      "credit",
      "brand",
      "developer_message",
      "developer_tag",
      "powered_by",
      "credit_by",
    ].forEach((k) => delete payload[k]);

    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    // Return combined debug + payload (so we can see both)
    return res.status(200).json({
      success: true,
      message: "OK (debug)",
      debug,
      payload,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error (debug)",
      error: err && err.message,
    });
  }
}
