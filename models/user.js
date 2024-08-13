import mongoose from "mongoose";

// const userdataSchema = new mongoose.Schema(
// {
//   email: {
//     type: String,
//     required: true,
//   },
//   firstname: String,
//   dob: Date,
//   address: String,
//   phone: Number,
//   state: String,
//   zip: String,
//   gender: String,
//   userType: String,
// }, {
//     timestamps: true,
//   }
// );

// export const  User = new mongoose.model("User", userdataSchema);

// import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   email: {
    type: String,
    required: true,
  },
  firstname: String,
  dob: Date,
  address: String,
  phone: Number,
  state: String,
  zip: String,
  gender: String,
  userType: String,
}, {
    timestamps: true,
  }
);

export const User = mongoose.model("User",userSchema );
