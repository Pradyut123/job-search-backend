import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(ErrorResponse("E-mail already registred", 400));
  }
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email) {
      return next(ErrorResponse("please add an email", 403));
    }
    if (!password) {
      return next(ErrorResponse("please add a password", 403));
    }

    //check user email
    const user = await User.findOne({ email });
    if (!user) {
      return next(ErrorResponse("invalid credentials", 400));
    }
    //check password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(ErrorResponse("invalid credentials", 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();
  res
    .status(codeStatus)
    .cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({ success: true, role: user.role });
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

// user profile
export const userProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
};
