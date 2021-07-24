const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
router.put("/:id", async (req, res) => {
  console.table({ ...req.body });
  if (req.body.userId == req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.body.userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      user.password = undefined;
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can only update your details");
  }
});

router.delete("/:id", async (req, res) => {
  console.table({ ...req.body });
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json("User not found");
      await Post.deleteMany({ username: user.username });
      await User.findByIdAndDelete(req.body.userId);
      return res.status(200).json("User Deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can only delete your details");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");
    user.password = undefined;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
