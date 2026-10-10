import { Schema, model } from "mongoose";
import { ReservationStatus } from "../types/index";
import type { ReservationDoc } from "../types/index";

const timePattern = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;

const reservationSchema = new Schema<ReservationDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roomId: {
      type: Number,
      required: [true, "Room ID is required"],
      min: [1, "Room ID must be greater than zero"],
    },
    date: {
      type: String,
      required: [true, "Reservation date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Enter a valid reservation date"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
      match: [timePattern, "Use a time such as 10:00 AM"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
      match: [timePattern, "Use a time such as 12:00 PM"],
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
      minlength: [3, "Purpose must be at least 3 characters"],
      maxlength: [250, "Purpose cannot exceed 250 characters"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ReservationStatus),
        message: "Status is not valid",
      },
      default: ReservationStatus.Pending,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, returnedObject) {
        const serialized = returnedObject as Record<string, unknown>;
        serialized.id = String(serialized._id);
        delete serialized._id;
        delete serialized.__v;
      },
    },
  },
);

export const ReservationModel = model<ReservationDoc>(
  "Reservation",
  reservationSchema,
);

