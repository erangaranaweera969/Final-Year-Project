import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export default authenticateToken;