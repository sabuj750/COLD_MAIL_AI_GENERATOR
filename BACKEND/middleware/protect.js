import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    // Check if authorization header exists and starts with Bearer
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not Authorized, no token or invalid format" });
    }
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not Authorized, user no longer exists" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not Authorized , token failed" });
  }
};

export default protect;
