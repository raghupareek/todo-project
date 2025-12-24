import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import appAssert from "../utils/appAssert.js";
import AppErrorCode from "../constants/appErrorCode.js";
import { BAD_REQUEST, CONFLICT, UNAUTHORIZED } from "../constants/http.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (email, password) => {
  appAssert(
    email && password,
    BAD_REQUEST,
    "Email and password are required",
    AppErrorCode.USER_MISSING_EMAIL_PASSWORD
  );
  const existing = await User.findOne({ email });
  appAssert(
    !existing,
    CONFLICT,
    "Email already in use",
    AppErrorCode.USER_EMAIL_EXISTS
  );
  const user = await User.create({ email, password });
  return { token: generateToken(user._id) };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  appAssert(
    user && (await bcrypt.compare(password, user.password)),
    UNAUTHORIZED,
    "Invalid credentials",
    AppErrorCode.USER_INVALID_CREDENTIALS
  );
  return { token: generateToken(user._id) };
};
