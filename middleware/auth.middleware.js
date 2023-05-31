import { tokenService } from "../services/token.services.js";

const users = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = tokenService.validateAccess(token);
    req.user = data;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default users;
