import express from "express";
import { UserModel } from "../models/user.model.js";
// import generateUserData from "../utils/helper.js";
import { tokenService } from "../services/token.services.js";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";

const router = express.Router({ mergeParams: true });

router.post(
  "/signUp",
  [
    check("email", "Error email").isEmail(),
    check("password", "Min length 8").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
            errors: errors.array(),
          },
        });
      }
      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: { message: "EMAIL_EXIST", code: 400 } });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await UserModel.create({
        // ...generateUserData(),
        ...req.body,
        password: hashedPassword,
      });

      const tokens = tokenService.generate({ _id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (e) {
      res.status(500).json({ message: "Sever error" });
    }
  }
);

router.post(
  "/signWithPassword",
  [
    check("email", "Email is incorrect").normalizeEmail().isEmail(),
    check("password", "Password is not leer").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
            errors: errors.array(),
          },
        });
      }
      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(400).send({
          error: {
            message: "EMAIL_NOT_FOUND",
            code: 400,
          },
        });
      }

      const isPassowrdEqual = bcrypt.compare(password, existingUser.password);
      if (!isPassowrdEqual) {
        return res.status(400).send({
          error: {
            message: "INVALID_PASSWORD",
            code: 400,
          },
        });
      }
      const tokens = tokenService.generate({ _id: existingUser._id });
      await tokenService.save(existingUser._id, tokens.refreshToken);
      res.status(200).send({
        ...tokens,
        userId: existingUser._id,
      });
    } catch (e) {
      res.status(500).json({
        message: "Server error, please leater",
      });
    }
  }
);

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

router.post("/token", async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const data = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);
    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: "Unathorized" });
    }
    const tokens = await tokenService.generate({
      _id: data._id,
    });
    await tokenService.save(data._id, tokens.refreshToken);
    res.status(200).json({ ...tokens, userId: data._id });
  } catch (e) {
    res.status(500).json({ message: "Sever error" });
  }
});

export default router;
