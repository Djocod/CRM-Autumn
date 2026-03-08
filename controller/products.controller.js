import {
  listProducts,
  getProductByBrand,
  addPurchasedProduct,
  addViewedProduct,
} from "../service/products.service.js";

export async function handleListProducts(req, res) {
  try {
    const products = await listProducts();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleGetProductsByBrand(req, res) {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).json({ message: "Missing product Brand" });
    }

    const product = await getProductByBrand(brand);
    if (!product) {
      return res.status(404).json({ message: "Product not found !" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handlePatchBuyProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const updated = await addPurchasedProduct(userId, productId);

    if (!updated) {
      return res.status(404).json({ message: "User not found !" });
    }

    return res.status(200).json({ purchased: updated.purchasedProducts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handlePatchViewProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const updated = await addViewedProduct(userId, productId);

    if (!updated) {
      return res.status(404).json({ message: "User not found !" });
    }

    return res.status(200).json({ viewed: updated.viewedProducts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
