import mongoose from "mongoose";

const policy_category = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PolicyCategory = mongoose.model("PolicyCategory", policy_category);
