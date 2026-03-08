import { Router } from "express";
import {
  handleGetProductsByBrand,
  handleListProducts,
  handlePatchBuyProducts,
  handlePatchViewProducts,
} from "../controller/products.controller.js";

const routerProducts = Router();
// READ
routerProducts.get("/", handleListProducts);
routerProducts.get("/search", handleGetProductsByBrand);

// PATCH
routerProducts.patch("/:productId/purchase", handlePatchBuyProducts);
routerProducts.patch("/:productId/viewed", handlePatchViewProducts);

export default routerProducts;
