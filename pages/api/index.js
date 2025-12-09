// pages/api/index.js
export default async function handler(req, res) {
  const REMOTE_BASE =
    process.env.REMOTE_API_BASE ||
    "https://reflexinfox.fwh.is/num.php";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);

    // query params (number, api_key, etc)
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
        Accept: "*/*",
      },
    });

    const html = await r.text();

    // 🔍 HTML ke andar se { ... } wala pehla JSON-jaisa hissa nikaal ne ki koshish
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

    // ❌ Remove Reflex InfoX credits
    delete payload.developer;
    delete payload.credit;
    delete payload.brand;
    delete payload.developer_message;
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
      message: "Server error",
      error: err.message,
    });
  }
}    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}  }
}  }
}
