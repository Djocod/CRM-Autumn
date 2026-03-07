import mongoose from "mongoose";
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    address: String,
    city: String,
    state: String,
    stateCode: String,
    postalCode: String,
    country: String,
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: String,
    image: String,
    address: addressSchema,
  },
  { timestamps: true },
);
const User = model("User", userSchema);
export default User;

// Concept	Explication
// required: true	Le champ est obligatoire
// unique: true	Pas de doublon en base (email, username)
// enum: [...]	Limite les valeurs autorisées
// _id: false	Évite qu'un _id soit généré pour les sous-documents
// timestamps: true	Ajoute createdAt / updatedAt automatiquement
