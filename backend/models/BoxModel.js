const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  chipId: {
    type: Number,
  },
  organisationId: {
    type: Number,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Organisation",
  },
  active: {
    type: Number,
  },
  topicRec: {
    type: String,
  },
  topicRes: {
    type: String,
  },
  version: {
    type: String,
  },
});

const Box = mongoose.model("Box", boxSchema);
module.exports = Box;
