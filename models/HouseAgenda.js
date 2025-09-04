import mongoose from "mongoose";

const houseAgendaProceedingSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const HouseAgendaProceeding = mongoose.model(
  "HouseAgendaProceeding",
  houseAgendaProceedingSchema
);

export default HouseAgendaProceeding;
