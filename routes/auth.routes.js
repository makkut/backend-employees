import express from "express";
import userController from "../controller/user.controller.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.post("/refresh", userController.refresh);
// router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

export default router;
