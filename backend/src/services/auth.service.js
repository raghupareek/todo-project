import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already in use");
  }
  const user = await User.create({ email, password });
  return { token: generateToken(user._id) };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return { token: generateToken(user._id) };
};
