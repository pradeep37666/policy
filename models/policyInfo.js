import mongoose from "mongoose";

const policy_info = new mongoose.Schema(
  {
    policy_number: {
      type: String,
      required: true,
    },
    policy_start_date: {
      type: Date,
      required: true,
    },
    policy_end_date: {
      type: Date,
      required: true,
    },
    policyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCategory",
    },
    policyCarrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCarrier",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const PolicyInfo = mongoose.model("PolicyInfo", policy_info);
