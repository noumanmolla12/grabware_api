import mongoose from "mongoose";

const publicNoticeSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    noticeNumber: {
      type: String,
      required: true,
      unique: true, // Each notice number should be unique
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
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const PublicNotice = mongoose.model("PublicNotice", publicNoticeSchema);

export default PublicNotice;
