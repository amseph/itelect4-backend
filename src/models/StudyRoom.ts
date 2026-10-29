import { Schema, model } from "mongoose";
import type { StudyRoomDoc } from "../types/index";

const studyRoomSchema = new Schema<StudyRoomDoc>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    building: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    hasProjector: { type: Boolean, required: true },
    isAvailable: { type: Boolean, required: true },
    amenities: {
      type: [
        {
          type: String,
          enum: ["aircon", "tv", "whiteboard", "projector", "quiet-zone"],
        },
      ],
      default: undefined,
    },
  },
  {
    toJSON: {
      transform(_document, returnedObject) {
        const serialized = returnedObject as Record<string, unknown>;
        delete serialized._id;
        delete serialized.__v;
      },
    },
  },
);

export const StudyRoomModel = model<StudyRoomDoc>("StudyRoom", studyRoomSchema);
