import type { Types } from "mongoose";

export enum Role {
  Student = "student",
  Admin = "admin",
}

export enum ReservationStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserDoc extends Omit<User, "id"> {}

export interface Reservation {
  id: string;
  userId: Types.ObjectId;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: ReservationStatus;
}

export type ReservationDoc = Omit<Reservation, "id">;

export type NewReservationBody = Pick<
  Reservation,
  "roomId" | "date" | "startTime" | "endTime" | "purpose" | "status"
>;

export type UpdateReservationBody = Partial<NewReservationBody>;

export interface IdParam {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

