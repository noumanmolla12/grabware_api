const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: ["RECRUITMENT","NEWS","EVENTS","PRESS RELEASE","Office Order","Circular","Tender"] },
    title: { type: String },
    details: { type: String },
    pdf: { type: String },   // for PDF files
    photo: { type: String }, // for images (jpg/png)
    validUpto: { type: Date },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);












