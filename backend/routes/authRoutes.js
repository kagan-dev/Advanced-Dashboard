const express = require("express");
const router = express.Router();
const {
  signup,
  logout,
  login,
  changePassword,
} = require("../controllers/authController");
const { protectRoute } = require("../middleware/protectRoute");

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/changepassword", protectRoute, changePassword);

module.exports = router;
