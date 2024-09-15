const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  deviceTypeId: {
    type: Number,
    required: true,
  },
  boxId: {
    type: Number,
    required: true,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Box",
  },
  description: {
    type: String,
    required: false,
  },
  pin: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
