// models/OrderCircular.js
const mongoose = require("mongoose");

const orderCircularSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    noticeNumber: {
      type: String,
      required: true,
      unique: true, // assuming each notice number is unique
      trim: true,
    },
    noticeDate: {
      type: Date,
      required: true,
    },
    noticeSubject: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderCircular", orderCircularSchema);
