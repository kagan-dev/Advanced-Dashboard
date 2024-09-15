// models/UserOrganisationModel.js
const mongoose = require("mongoose");

const userOrganisationSchema = new mongoose.Schema({
  id: { type: Number },
  userId: { type: Number, required: true },
  organisationId: { type: Number, required: true },
});

const UserOrganisation = mongoose.model(
  "UserOrganisation",
  userOrganisationSchema
);

module.exports = UserOrganisation;
