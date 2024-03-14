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
    floor,
    imageSrc,
    category,
    capacity,
    whiteboards,
    computers,
    projector,
    buildingId
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const building = await prisma.room.create({
    data: {
        floor,
        imageSrc,
        category,
        capacity,
        whiteboards,
        computers,
        projector,
        buildingId
    }
  });

  return NextResponse.json(building);
}