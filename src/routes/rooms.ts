import { Router } from "express";
import { StudyRoomModel } from "../models/StudyRoom";
import type { IdParam } from "../types/index";

export const roomRouter = Router();

roomRouter.get("/", async (_req, res) => {
  try {
    const rooms = await StudyRoomModel.find().sort({ id: 1 });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load rooms" });
  }
});

roomRouter.get<IdParam>("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  try {
    const room = await StudyRoomModel.findOne({ id });
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load the room" });
  }
});
