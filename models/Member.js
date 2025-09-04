const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
