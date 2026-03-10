import User from "../model/schema.users.js";
import Product from "../model/schema.products.js";

const champs = {
  _id: true,
  gender: true,
  email: true,
  phone: true,
  cell: true,
  nat: true,

  name: {
    title: true,
    first: true,
    last: true,
  },

  location: {
    street: {
      number: true,
      name: true,
    },
    city: true,
    state: true,
    country: true,
    postcode: true,
    coordinates: {
      latitude: true,
      longitude: true,
    },
    timezone: {
      offset: true,
      description: true,
    },
  },

  login: {
    uuid: true,
    username: true,
    password: true,
    salt: true,
    md5: true,
    sha1: true,
    sha256: true,
  },

  dob: {
    date: true,
    age: true,
  },

  registered: {
    date: true,
    age: true,
  },

  // id: {
  //   name: true,
  //   value: true,
  // },

  picture: {
    large: true,
    medium: true,
    thumbnail: true,
  },

  purchaseSessions: true,
  viewSessions: true,
};

export async function findUserByLastName(lastName) {
  return User.find({ "name.last": { $regex: lastName, $options: "i" } }, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product");
}

export async function findAllUser() {
  return User.find({}, champs);
}

export async function findUserById(_id) {
  return User.findById(_id, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product");
}

// ===========================================
// Add purchase session
export async function addPurchasedProduct(
  userId,
  productId,
  quantity = 1,
  priceAtPurchase,
) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        purchaseSessions: {
          date: new Date(),
          products: [{ product: productId, quantity, priceAtPurchase }],
        },
      },
    },
    { new: true },
  );
}
// Add view session
export async function addViewedProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        viewSessions: {
          date: new Date(),
          products: [{ product: productId }],
        },
      },
    },
    { new: true },
  );
}
