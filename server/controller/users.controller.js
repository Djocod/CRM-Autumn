import {
  findUserByLastName,
  findAllUser,
  findUserById,
  addPurchasedProduct,
  addViewedProduct,
} from "../service/users.service.js";

export async function handleGetUser(req, res) {
  try {
    const { lastname } = req.params;
    if (!lastname) {
      return res.status(400).json({
        message: "Missing user last name",
      });
    }
    const user = await findUserByLastName(lastname);
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleGetAllUser(req, res) {
  try {
    const user = await findAllUser();
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Missing user Id",
      });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ====================================================
// new road for add product on purchase and viewed
export async function handlePatchBuyProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const updated = await addPurchasedProduct(userId, productId);

    if (!updated) {
      return res.status(404).json({ message: "Product not found !" });
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
      return res.status(404).json({ message: "Product not found !" });
    }

    return res.status(200).json({ viewed: updated.viewedProducts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
