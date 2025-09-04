import mongoose from "mongoose";

const eNewsletterSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ENewsletter = mongoose.model("ENewsletter", eNewsletterSchema);

export default ENewsletter;
