import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    name: {
      title: { type: String, trim: true },
      first: { type: String, required: true, trim: true },
      last: { type: String, required: true, trim: true },
    },

    location: {
      street: {
        number: { type: Number },
        name: { type: String, trim: true },
      },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postcode: { type: String, trim: true },
      coordinates: {
        latitude: { type: String },
        longitude: { type: String },
      },
      timezone: {
        offset: { type: String },
        description: { type: String, trim: true },
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    login: {
      uuid: { type: String, unique: true },
      username: { type: String, unique: true, trim: true },
      password: { type: String }, // à hasher côté app avant insertion
      salt: { type: String },
      md5: { type: String },
      sha1: { type: String },
      sha256: { type: String },
    },

    dob: {
      date: { type: Date },
      age: { type: Number },
    },

    registered: {
      date: { type: Date },
      age: { type: Number },
    },

    phone: { type: String, trim: true },
    cell: { type: String, trim: true },

    // id: {
    //   name: { type: String, trim: true }, // ex: "NINO"
    //   value: { type: String, trim: true }, // ex: "JJ 78 69 72 V"
    // },

    picture: {
      large: { type: String, trim: true },
      medium: { type: String, trim: true },
      thumbnail: { type: String, trim: true },
    },

    nat: {
      type: String,
      uppercase: true,
      trim: true,
    },
    purchasedProducts: [
      { type: Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
    viewedProducts: [
      { type: Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);
export default User;
