import mongoose from "mongoose";

const user_account = new mongoose.Schema(
  {
    account_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserAccount = mongoose.model("UserAccount", user_account);
