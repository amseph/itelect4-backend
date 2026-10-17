import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db";
import { authRouter } from "./routes/auth";
import { reservationRouter } from "./routes/reservations";
import { roomRouter } from "./routes/rooms";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  }),
);
app.use(express.json());

app.use((_req, _res, next) => {
  connectDatabase().then(() => next()).catch(next);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/reservations", reservationRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

