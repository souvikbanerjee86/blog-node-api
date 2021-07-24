const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  console.table({ ...req.body });
  try {
    const post = new Post(req.body);
    const savePost = await post.save();

    return res.status(200).json(savePost);
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

router.put("/:id", async (req, res) => {
  console.table({ ...req.body });
  try {
    const post = await Post.findById(req.params.id);
    if (post.username == req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        return res.status(200).json(updatedPost);
      } catch (err) {
        return res.status(500).json("Some Error Occured");
      }
    } else {
      return res.status(401).json("You can only update your post");
    }
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

router.delete("/:id", async (req, res) => {
  console.table({ ...req.body });
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.username);
    console.log(req.body);
    if (post.username == req.body.username) {
      try {
        await post.delete();
        return res.status(200).json("Post has been deleted");
      } catch (err) {
        return res.status(500).json("Some Error Occured");
      }
    } else {
      return res.status(401).json("You can only delete your post");
    }
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});
router.get("/", async (req, res) => {
  try {
    const username = req.query.user;
    const catName = req.query.cat;
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json("Some Error Occured");
  }
});

module.exports = router;
