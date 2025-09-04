import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    nameOfWork: {
      type: String,
      required: true,
      trim: true,
    },
    lastDateOfSubmission: {
      type: Date,
      required: true,
    },
    openingDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Tender = mongoose.model("Tender", tenderSchema);

export default Tender;
