const { User } = require("../models");

async function getUsers(req, res) {
  try {
    const { role } = req.query || {};
    const query = role ? { role } : {};
    const users = await User.find(query).select("name role").sort({ name: 1 }).lean();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getUsers,
};
