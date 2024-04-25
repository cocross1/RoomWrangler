import { User, Reservation, Room } from "@prisma/client";

export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
}

export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startTime" | "endTime" | "room"
> & {
  createdAt: string;
  startTime: string;
  endTime: string;
  room: Room;
}