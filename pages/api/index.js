// pages/api/index.js

export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "Test OK from RK API",
  });
}
