import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const authRouter = Router();

authRouter.post<unknown, unknown, RegisterBody>("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email?.toLowerCase() });

    if (existingUser) {
      res.status(409).json({ message: "That email is already registered" });
      return;
    }

    const user = await UserModel.create({ name, email, password });
    res.status(201).json(user.toJSON());
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Error & { code: number }).code === 11000
    ) {
      res.status(409).json({ message: "That email is already registered" });
      return;
    }

    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ message: "Registration details are invalid" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Unable to register. Please try again." });
  }
});

authRouter.post<unknown, unknown, LoginBody>("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email: email?.toLowerCase(),
    }).select("+password");

    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Email or password is incorrect" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" },
    );

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to log in. Please try again." });
  }
});

