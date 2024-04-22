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

  const { 
    roomId,
    startTime,
    endTime,
    displayName,
    createdAt,
    type,
    contactName,
    weekly
   } = body;

   console.log(weekly);
   const numberOfWeeks = 16;
   let reservations = [];
  // Fetch existing reservations for the room
  const existingReservations = await getReservationsByRoomId(roomId);
  for (let week = 0; week < (weekly ? numberOfWeeks : 1); week++) {
    // Calculate new start and end times for each week
    let newStartTime = new Date(startTime);
    newStartTime.setDate(newStartTime.getDate() + 7 * week);
    
    let newEndTime = new Date(endTime);
    newEndTime.setDate(newEndTime.getDate() + 7 * week);
    
    // Fetch existing reservations for the room
    const existingReservations = await getReservationsByRoomId(roomId);
    let hasOverlap = false;
    
    // Check for overlapping reservations if existingReservations is not null
    if (existingReservations && existingReservations.length > 0) {
      hasOverlap = existingReservations.some((reservation) => {
        return (
          newStartTime < new Date(reservation.endTime) &&
          newEndTime > new Date(reservation.startTime) &&
          roomId == reservation.roomId
        );
      });
    }

    if (
      hasOverlap ||
      newStartTime > newEndTime ||
      newStartTime < new Date()
    ) {
      // Handle overlap or invalid time by either stopping the loop or adjusting logic as needed
      console.log(`Overlap or invalid time for week ${week + 1}`);
      return NextResponse.error(); // or return NextResponse.error();
    }

    // Create reservation for this week
    const reservation = await prisma.reservation.create({
      data: {
        userId: currentUser.id,
        roomId,
        startTime: newStartTime,
        endTime: newEndTime,
        displayName,
        createdAt,
        type,
        contactName,
      }
    });
    
    reservations.push(reservation);
  }

  // Return all created reservations
  return NextResponse.json(reservations);
}
