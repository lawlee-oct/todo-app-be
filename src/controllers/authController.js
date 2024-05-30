const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");

const { AuthModel } = require("../models/AuthModel");
const { TokenModel } = require("../models/TokenModel");

const authController = {
  // CREATE TOKEN
  createAccessToken: (user) => {
    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "30d",
      }
    );
    return accessToken;
  },

  // REFRESH TOKEN
  createRefreshToken: (user) => {
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
    return refreshToken;
  },

  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await brcypt.genSalt(10);
      const hashed = await brcypt.hash(req.body.password, salt);

      const checkUser = await AuthModel.findOne({ email: req.body.email });

      if (checkUser) {
        return res.status(404).json({ message: "Email already exists!" });
      }

      // Create new User
      const newUser = await new AuthModel({
        ...req.body,
        email: req.body.email,
        password: hashed,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
      });

      // Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await AuthModel.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({ message: "Wrong email!" });
      }

      const validatorPass = await brcypt.compare(
        req.body.password,
        user.password
      );

      if (!validatorPass) {
        res.status(404).json({ message: "Wrong password!" });
      }

      if (user && validatorPass) {
        const accessToken = authController.createAccessToken(user);
        const refreshToken = authController.createRefreshToken(user);

        const saveRefreshToken = new TokenModel({ token: refreshToken });
        await saveRefreshToken.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...infoOthers } = user._doc;
        res.status(200).json({
          data: { ...infoOthers },
          access_token: accessToken,
          refresh_token: refreshToken,
          message: "Login Success!",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Logout
  logOut: async (req, res) => {
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout Success" });
  },

  // GETME
  getMe: async (req, res) => {
    try {
      const user = await AuthModel.findOne({ _id: req.user.id });

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authController;
