import { findUserByLastName } from "./users.service.js";

export async function handleGetUser(req, res) {
  try {
    const { lastName } = req.params;
    if (!lastName) {
      return res.status(400).json({
        message: "Missing user last name",
      });
    }
    const user = await findUserByLastName(lastName);
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
