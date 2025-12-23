import { registerUser, loginUser } from "../services/auth.service.js";
import catchErrors from "../utils/catchErrors.js";

export const register = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const result = await registerUser(email, password);
  res.status(201).json(result);
});

export const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.json(result);
});
