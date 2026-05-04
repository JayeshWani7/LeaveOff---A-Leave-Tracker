const bcrypt = require("bcrypt");

const { User } = require("../models");
const { issueToken } = require("../middleware/auth");

async function login(req, res) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required." });
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }


    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = issueToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  login,
};
