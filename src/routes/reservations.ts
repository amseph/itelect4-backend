import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { requireAuth } from "../middleware/auth";
import { ReservationModel } from "../models/Reservation";
import type {
  IdParam,
  NewReservationBody,
  UpdateReservationBody,
} from "../types/index";
import { ReservationStatus } from "../types/index";

export const reservationRouter = Router();

reservationRouter.use(requireAuth);

reservationRouter.get("/", async (req, res) => {
  try {
    const reservations = await ReservationModel.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load reservations" });
  }
});

reservationRouter.get<IdParam>("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    const reservation = await ReservationModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load the reservation" });
  }
});

reservationRouter.post<unknown, unknown, NewReservationBody>(
  "/",
  async (req, res) => {
    try {
      const reservation = await ReservationModel.create({
        ...req.body,
        userId: req.userId,
        status: ReservationStatus.Pending,
      });

      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        res.status(400).json({ message: "Reservation details are invalid" });
        return;
      }

      console.error(error);
      res.status(500).json({ message: "Unable to create the reservation" });
    }
  },
);

reservationRouter.patch<IdParam, unknown, UpdateReservationBody>(
  "/:id",
  async (req, res) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      const {
        roomId,
        date,
        startTime,
        endTime,
        purpose,
        status,
      } = req.body;
      const allowedChanges = {
        ...(roomId !== undefined && { roomId }),
        ...(date !== undefined && { date }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(purpose !== undefined && { purpose }),
        ...(status !== undefined && { status }),
      };

      const reservation = await ReservationModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        allowedChanges,
        { new: true, runValidators: true },
      );

      if (!reservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      res.json(reservation);
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        res.status(400).json({ message: "Reservation details are invalid" });
        return;
      }

      console.error(error);
      res.status(500).json({ message: "Unable to update the reservation" });
    }
  },
);

reservationRouter.delete<IdParam>("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    const reservation = await ReservationModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete the reservation" });
  }
});

