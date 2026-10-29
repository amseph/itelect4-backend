import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { StudyRoomModel } from "../models/StudyRoom";
import type { StudyRoom } from "../types/index";

const existingSeedRooms: StudyRoom[] = [
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

const additionalRooms: StudyRoom[] = [
  {
    id: 104,
    name: "Quiet Study Room D",
    building: "Learning Commons",
    capacity: 4,
    hasProjector: false,
    isAvailable: true,
    amenities: ["aircon", "quiet-zone"],
  },
  {
    id: 105,
    name: "Media Study Room E",
    building: "Main Library",
    capacity: 6,
    hasProjector: false,
    isAvailable: true,
    amenities: ["aircon", "tv", "whiteboard"],
  },
  {
    id: 106,
    name: "Group Discussion Room F",
    building: "Student Center",
    capacity: 8,
    hasProjector: false,
    isAvailable: false,
    amenities: ["aircon", "whiteboard"],
  },
  {
    id: 107,
    name: "Solo Study Pod G",
    building: "Learning Commons",
    capacity: 1,
    hasProjector: false,
    isAvailable: true,
    amenities: ["aircon", "quiet-zone"],
  },
  {
    id: 108,
    name: "Presentation Room H",
    building: "Engineering Building",
    capacity: 12,
    hasProjector: true,
    isAvailable: true,
    amenities: ["aircon", "tv", "projector"],
  },
  {
    id: 109,
    name: "Collaborative Room I",
    building: "Main Library",
    capacity: 6,
    hasProjector: false,
    isAvailable: true,
    amenities: ["whiteboard", "tv"],
  },
  {
    id: 110,
    name: "Silent Research Room J",
    building: "Science Building",
    capacity: 4,
    hasProjector: false,
    isAvailable: true,
    amenities: ["aircon", "quiet-zone"],
  },
  {
    id: 111,
    name: "Study Lounge K",
    building: "Student Center",
    capacity: 10,
    hasProjector: false,
    isAvailable: false,
    amenities: ["aircon"],
  },
  {
    id: 112,
    name: "Multimedia Room L",
    building: "Media Center",
    capacity: 8,
    hasProjector: true,
    isAvailable: true,
    amenities: ["tv", "projector", "whiteboard"],
  },
  {
    id: 113,
    name: "Small Group Room M",
    building: "Learning Commons",
    capacity: 3,
    hasProjector: false,
    isAvailable: true,
    amenities: ["aircon", "quiet-zone"],
  },
];

const roomsToSeed = [...existingSeedRooms, ...additionalRooms];
const dryRun = process.argv.includes("--dry-run");

async function seed(): Promise<void> {
  if (dryRun) {
    console.log("Dry run: no database connection or writes were performed.");
    console.log(
      "IDs 101–103 will only be inserted if missing; existing records will not be updated.",
    );
    console.log(
      `Prepared ${additionalRooms.length} additional demo rooms (IDs 104–113):`,
    );
    console.log(JSON.stringify(additionalRooms, null, 2));
    return;
  }

  let inserted = 0;
  let preserved = 0;

  try {
    await connectDatabase();

    for (const room of roomsToSeed) {
      const result = await StudyRoomModel.updateOne(
        { id: room.id },
        { $setOnInsert: room },
        { upsert: true, runValidators: true },
      );

      if (result.upsertedCount > 0) {
        inserted += 1;
      } else {
        preserved += 1;
      }
    }

    console.log(
      `Seed complete: inserted ${inserted} missing room(s); preserved ${preserved} existing room(s).`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error: unknown) => {
  const errorType = error instanceof Error ? error.name : "UnknownError";
  console.error(`Unable to seed study rooms (${errorType}).`);
  process.exitCode = 1;
});
