import mongoose from "mongoose";

const policy_carrier = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PolicyCarrier = mongoose.model("PolicyCarrier", policy_carrier);
