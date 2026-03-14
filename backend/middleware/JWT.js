const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Middleware to check token and regenerate if expired
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Try verifying the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      // Token is valid
      next();
    } catch (err) {
      // Token invalid or expired
      if (err.name === "TokenExpiredError") {
        try {
          // Decode without verifying to get payload
          const decoded = jwt.decode(token);

          // Optionally: check if user still exists
          const user = await User.findById(decoded.id).select("-password");
          if (!user) return res.status(401).json({ message: "User no longer exists" });

          // Generate a new token
          const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          // Attach user and new token
          req.user = user;
          res.setHeader("x-access-token", newToken); // send token in response headers

          next();
        } catch (err2) {
          return res.status(401).json({ message: "Token expired. Please login again." });
        }
      } else {
        return res.status(401).json({ message: "Not authorized, invalid token" });
      }
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
