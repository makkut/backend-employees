import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    birthdate: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: new Schema({
      city: { type: String, required: true },
      zip: { type: String, required: true },
      street: { type: String, required: true },
      number: { type: String, required: true },
      _id: false,
    }),
  },
  { timestamps: { createdAt: "created_at" } }
);

export const EmployeesModel = model("Employees", schema);
