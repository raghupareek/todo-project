import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ email, password });
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    console.error(err);
    // If duplicate key slipped through, still catch it
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user._id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
