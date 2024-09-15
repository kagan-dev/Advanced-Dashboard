const mongoose = require("mongoose");

// Define the schema for DeviceType
const deviceTypeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Ensure unique IDs
  },
  name: {
    type: String,
    required: false, // Nullable
  },
  menuId: {
    type: Number,
    required: false, // Nullable
  },
});

// Create the DeviceType model based on the schema
const DeviceType = mongoose.model("DeviceType", deviceTypeSchema);

module.exports = DeviceType;
