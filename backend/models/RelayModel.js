const mongoose = require("mongoose");

const relaySchema = new mongoose.Schema({
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

const Relay = mongoose.model("Relay", relaySchema);
module.exports = Relay;
