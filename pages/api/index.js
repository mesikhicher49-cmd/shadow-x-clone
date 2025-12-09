export default async function handler(req, res) {
  try {
    const number = req.query.number;
    const api_key = req.query.api_key;

    if (!number || !api_key) {
      return res.status(400).json({
        success: false,
        message: "number and api_key required"
      });
    }

    // 🔥 FINAL BROWSERLESS BYPASS URL
    const finalUrl =
      `https://api.allorigins.win/raw?url=` +
      encodeURIComponent(
        `https://reflexinfox.fwh.is/num.php?mobile=${number}&key=${api_key}`
      );

    const r = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const txt = await r.text();

    let data;
    try {
      data = JSON.parse(txt);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Upstream not returning valid JSON",
        preview: txt.slice(0, 500)
      });
    }

    // ❌ Remove original credits
    delete data.developer;
    delete data.credit;

    // ✔ Add your credits
    data.developer = "@rkmod_x";
    data.brand = "Api By R K";

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
