const jwt = require("jsonwebtoken");

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ msg: "no token provided" });
    }
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      return next();
    }
  } catch (error) {
    res.redirect("/");
  }
};

module.exports = authenticationMiddleware;
