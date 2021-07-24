const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.table({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = User({ username, email, password: hashPassword });
    const user = await newUser.save();
    user.password = undefined;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.table({ username, password });

    const user = await User.findOne({ username: username });
    if (!user) return res.status(401).json("Wrong Credentials");
    const validated = await bcrypt.compare(password, user.password);
    if (!validated) return res.status(401).json("Wrong Credentials");
    user.password = undefined;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
