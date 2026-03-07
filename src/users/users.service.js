import User from "./schemaUsers.js";

const champs = {
  id: true,
  firstName: true,
  lastName: true,
  age: true,
  gender: true,
  email: true,
  phone: true,
  username: true,
  adress: {
    address: true,
    city: true,
    state: true,
    stateCode: true,
    postalCode: true,
    country: true,
  },
};

export async function findUserByLastName(lastName) {
  return User.findOne(
    { lastName },
    "firstName lastName age gender email phone username address",
  );
}
