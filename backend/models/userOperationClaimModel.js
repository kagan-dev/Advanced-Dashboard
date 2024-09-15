const mongoose = require("mongoose");

const userOperationClaimSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: false,
  },
  operationClaimId: {
    type: Number,
    required: false,
  },
});

const UserOperationClaim = mongoose.model(
  "UserOperationClaim",
  userOperationClaimSchema
);
module.exports = UserOperationClaim;
