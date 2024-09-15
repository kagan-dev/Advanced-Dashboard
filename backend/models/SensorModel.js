const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  deviceTypeId: {
    type: Number,
  },
  topicStat: {
    type: String,
  },
  topicRec: {
    type: String,
  },
  topicRes: {
    type: String,
  },
  description: {
    type: String,
  },
  boxId: {
    type: Number,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Box",
  },
  pin: {
    type: String,
  },
  active: {
    type: Number,
  },
});

const Sensor = mongoose.model("Sensor", sensorSchema);
module.exports = Sensor;
