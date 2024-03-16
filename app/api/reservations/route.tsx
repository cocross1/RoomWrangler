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
    name,
    createdAt,
    type,
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

    // Upsert building based on buildingName
    const building = await prisma.building.upsert({
        where: { buildingName: buildingName },
        update: {}, // No update operation required in this context
        create: {
          buildingName: buildingName,
        }
      });
    

  const room = await prisma.room.create({
    data: {
        floor,
        imageSrc,
        category,
        capacity,
        whiteboards,
        computers,
        projector,
        buildingId:building.id
    }
  });

  return NextResponse.json(building);
}