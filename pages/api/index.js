export default async function handler(req, res) {
  const REMOTE_BASE = "https://numapi.anshapi.workers.dev/";

  try {
    const upstreamUrl = new URL(REMOTE_BASE);
    Object.entries(req.query || {}).forEach(([k, v]) => {
      upstreamUrl.searchParams.append(k, v);
    });

    const r = await fetch(upstreamUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/plain, */*",
      },
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ success: false, message: "Upstream error", upstreamStatus: r.status, preview: t.slice(0, 300) });
    }

    const payload = await r.json();

    // Remove any unwanted credit fields (agar koi ho)
    delete payload.developer;
    delete payload.credit;
    delete payload.brand;

    // Add your own credit
    payload.developer = "@rkmod_x";
    payload.brand = "Api By R K";

    return res.status(200).json(payload);

  } catch (err) {
    return res.status(500).json({ success:false, message:"Server error", error: err.message });
  }
}      "powered_by",
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
