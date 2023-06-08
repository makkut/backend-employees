import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  { timestamps: true }
);

const UsersModel = model("Users", schema);
export default UsersModel;
