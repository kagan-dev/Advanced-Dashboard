const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  cityId: {
    type: Number,
  },
  districtId: {
    type: Number,
  },
  type: {
    type: Number,
  },
  maxUserCount: {
    type: Number,
  },
  maxSessionCount: {
    type: Number,
  },
});

const Organisation = mongoose.model("Organisation", organisationSchema);
module.exports = Organisation;
