import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservationsByRoomId from "@/app/actions/getReservationsByRoomId";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { roomId, startTime, endTime, displayName, createdAt, type } = body;

  // Fetch existing reservations for the room
  const existingReservations = await getReservationsByRoomId(roomId);
  let hasOverlap = false;
  // Check for overlapping reservations
  if (existingReservations) {
    hasOverlap = existingReservations.some((reservation) => {
      return (
        new Date(startTime) < new Date(reservation.endTime) &&
        new Date(endTime) > new Date(reservation.startTime) &&
        roomId == reservation.roomId
      );
    });
  }

  // If overlap exists, return an error response
  if (
    hasOverlap ||
    new Date(startTime) > new Date(endTime) ||
    new Date(startTime) < new Date()
  ) {
    return NextResponse.error();
  }

  console.log("Formatted startTime:", body.startTime);
  console.log("Formatted endTime:", body.endTime);
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const reservation = await prisma.reservation.create({
    data: {
      userId: currentUser.id,
      roomId,
      startTime,
      endTime,
      displayName,
      createdAt,
      type,
    },
  });

  return NextResponse.json(reservation);
}
