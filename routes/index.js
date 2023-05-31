import express from "express";
import auth from "./auth.routes.js";
import user from "./user.routes.js";
import employees from "./employees.routes.js";

const router = express.Router({ mergeParams: true });

router.use("/auth", auth);
router.use("/user", user);
router.use("/employees", employees);

export default router;
