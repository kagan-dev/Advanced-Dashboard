const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protectRoute = async (req, res, next) => {
  try {
    // Authorization başlığından token'ı al
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }

    console.log("Decoded token:", decoded); // Debugging: token'dan alınan verileri kontrol et

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { protectRoute };
