import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request, 
) {

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
   } = body;

   
   console.log("Formatted startTime:", body.startTime);
   console.log("Formatted endTime:", body.endTime);
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
    

  const reservation = await prisma.reservation.create({
    data: {
        userId:currentUser.id,
        roomId,
        startTime,
        endTime,
        displayName,
        createdAt,
        type,
    }
  });

  return NextResponse.json(reservation);
}