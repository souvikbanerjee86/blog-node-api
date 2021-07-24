const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
  const category = new Category(req.body);
  try {
    const savecategory = await category.save();
    return res.status(200).json(savecategory);
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    return res.status(200).json(cats);
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

module.exports = router;
