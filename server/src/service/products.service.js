import Products from "../../model/schema.products.js";
import Users from "../../model/schema.users.js";

const champs =
  "id title brand category price currency stock description image tags";

// list all Product
export async function listProducts() {
  return Products.find({}, champs);
}

// Product by id
export async function getProductByBrand(brand) {
  return Products.find({ brand: brand }, champs);
}

// Add product buy by users
export async function addPurchasedProduct(userId, productId) {
  return Users.findByIdAndUpdate(
    userId,
    { $addToSet: { purchasedProducts: productId } },
    { new: true },
  );
}
// Add product view by users
export async function addViewedProduct(userId, productId) {
  return Users.findByIdAndUpdate(
    userId,
    { $addToSet: { viewedProducts: productId } },
    { new: true },
  );
}
