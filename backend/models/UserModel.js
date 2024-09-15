const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  userName: {
    type: String,
  },
  fullName: {
    type: String,
  },
  password: {
    type: String,
  },
  mail: {
    type: String,
  },
  telephone: {
    type: String,
  },
  active: {
    type: Number,
  },
  passwordHash: {
    type: String,
  },
  passwordSalt: {
    type: String,
  },
});

// Model zaten tanımlanmış mı kontrol et
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
