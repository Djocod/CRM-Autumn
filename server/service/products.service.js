import Products from "../model/schema.products.js";

const champs = {
  _id: true,
  title: true,
  brand: true,
  category: true,
  price: true,
  currency: true,
  stock: true,
  description: true,
  image: true,
  tags: true,
  ref: true,
  sizes: true,
  colors: true,
};

// list all Product
export async function listProducts() {
  return Products.find({}, champs);
}

// Product by brand (case-insensitive)
export async function getProductByBrand(brand) {
  return Products.find({ brand: { $regex: brand, $options: "i" } }, champs);
}

// // Add product buy by users
// export async function addPurchasedProduct(userId, productId) {
//   return Users.findByIdAndUpdate(
//     userId,
//     { $addToSet: { purchasedProducts: productId } },
//     { new: true },
//   );
// }
// // Add product view by users
// export async function addViewedProduct(userId, productId) {
//   return Users.findByIdAndUpdate(
//     userId,
//     { $addToSet: { viewedProducts: productId } },
//     { new: true },
//   );
// }
