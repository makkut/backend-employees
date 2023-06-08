import express from "express";
import UsersModel from "../models/users.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.patch("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id) {
      const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      res.send(updatedUser);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const list = await UsersModel.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
