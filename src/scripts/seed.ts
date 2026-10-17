import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { StudyRoomModel } from "../models/StudyRoom";

const rooms = [
  {
    id: 101,
    name: "Quiet Study Room A",
    building: "Learning Commons",
    capacity: 6,
    hasProjector: true,
    isAvailable: true,
  },
  {
    id: 102,
    name: "Collaboration Room B",
    building: "Main Library",
    capacity: 10,
    hasProjector: true,
    isAvailable: true,
  },
  {
    id: 103,
    name: "Research Pod C",
    building: "Learning Commons",
    capacity: 4,
    hasProjector: false,
    isAvailable: false,
  },
];

async function seed(): Promise<void> {
  try {
    await connectDatabase();
    for (const room of rooms) {
      await StudyRoomModel.updateOne(
        { id: room.id },
        { $set: room },
        { upsert: true, runValidators: true },
      );
    }
    console.log(`Seeded ${rooms.length} study rooms`);
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error: unknown) => {
  console.error("Unable to seed study rooms", error);
  process.exitCode = 1;
});
