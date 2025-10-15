const jwt = require("jsonwebtoken");

const { getUserByEmail } = require("../controllers/user");

const isValidUser = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByEmail(decoded.email);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};


// to check if the user is an admin or not
const isAdmin = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    // 1. extract the token from authorization header
    // method 1 - .replace
    const token = authorization.replace("Bearer ", "");
    // method 2 - .split
    // const token = authorization.split(" ")[1];
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. get the user data by email
    const user = await getUserByEmail(decoded.email);
    // 4. verify if user exists and is an admin
    if (user && user.role === "admin") {
      // add the user data into the request
      req.user = user;
      // trigger the next function
      next();
    } else {
      // trigger error if not admin
      res.status(400).send({ error: "YOU SHALL NOT PASS" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "YOU SHALL NOT PASS" });
  }
};

module.exports = {
  isValidUser,
  isAdmin,
};
