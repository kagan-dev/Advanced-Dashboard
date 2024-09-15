const mongoose = require("mongoose");

const userDeviceSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  deviceId: {
    type: Number,
    required: true,
  },
  deviceTypeId: {
    type: Number,
    required: true,
  },
  boxId: {
    type: Number,
    required: true,
  },
});

const UserDevice = mongoose.model("UserDevice", userDeviceSchema);
module.exports = UserDevice;
