const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("./validation/authValidation");

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    // return console.log(value);
    // Get Data
    const { username, email, password, role } = value;
    // Validated Data
    // if (!username || !email || !password)
    //   return res.status(400).json({ msg: "Missing Data" });

    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ msg: "Account Already Exist" });
    // Create User
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    // Response
    res.status(201).json({
      msg: "Done Created User",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    // Validated Data
    if (!email || !password)
      return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "Account Not Found Please Create Account" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ msg: "Invalid Password" });

    // const authCode = Buffer.from(user._id.toString()).toString("base64");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SCKRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      msg: "Success Login",
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
