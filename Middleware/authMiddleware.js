const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.json({ msg: "Token Not Found" });

    const token = authHeader.split(" ")[1];

    const docecodToken = jwt.verify(token, process.env.JWT_SCKRET);

    req.user = docecodToken;

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
