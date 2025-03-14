import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "./backend/.env",
});

const SECRET_KEY = process.env.REFRESH_SECRET_KEY;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["cookie"];
  const token = authHeader && authHeader.split("=")[1]; //Bearer TOKEN => split and take the token

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token is missing" });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid Token" });
    req.userId = user._id;
    req.userRole = user.role;
    next();
  });
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    next();
  };
};
