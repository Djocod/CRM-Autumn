import {
  listProducts,
  getProductByBrand,
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

    const products = await getProductByBrand(brand);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Product not found !" });
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
