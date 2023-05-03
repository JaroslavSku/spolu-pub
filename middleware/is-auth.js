const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("Není možné ověřit token.");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.id;
    req.userType = decodedToken.userType;
    req.level = decodedToken.level;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  next();
};
