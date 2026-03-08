import {
  findUserByLastName,
  findAllUser,
  findUserById,
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
