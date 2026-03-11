// pages/api/index.js
export default async function handler(req, res) {
try {
const mobile = req.query.mobile;
const key = req.query.key;

if (!mobile || !key) {
  return res.status(400).json({
    success: false,
    message: "Missing parameters: mobile & key are required",
  });
}

// New upstream API
const upstreamUrl = `https://usesirosint.vercel.app/api/numinfo?key=NIGHTFALLHUBz&num=${encodeURIComponent(mobile)}`;

const r = await fetch(upstreamUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
  },
});

const data = await r.json();

// Remove original credits
delete data.developer;
delete data.credit;
delete data.brand;
delete data.Owner;

// Add your owner
data.Owner = "@ZyroX9";

return res.status(200).json(data);

} catch (err) {
return res.status(500).json({
success: false,
message: err.message,
});
}
}
