import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth";
import { reservationRouter } from "./routes/reservations";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/reservations", reservationRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

