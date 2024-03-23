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

  // left category here but it's not actually getting pushed to the database since it's no longer in the schema
  const body = await request.json();
  const { 
    building,
    number,
    buildingAndNumber,
    floor,
    imageSrc,
    category,
    capacity,
    whiteboards,
    computers,
    projectors,
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
    

  const room = await prisma.room.create({
    data: {
        building,
        number,
        buildingAndNumber,
        floor,
        imageSrc,
        capacity,
        whiteboards,
        computers,
        projectors,
    }
  });

  return NextResponse.json(room);
}