import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    buildingName: providedBuildingName,
    number,
    buildingAndNumber,
    floor,
    imageSrc,
    capacity,
    whiteboards,
    computers,
    projectors,
  } = body;

  const isCreation = !providedBuildingName;
  const requiredFields = isCreation? ['buildingName', 'buildingAndNumber', 'number', 'floor'] : ['buildingAndNumber', 'floor'];

  for (const field of requiredFields) {
    if(body[field] === undefined) {
      return NextResponse.error();
    }
  }

  let buildingName = providedBuildingName;
  console.log(buildingName);
  let buildingId = '';

  // Object.keys(body).forEach((value: any) => {
  //   if (!body[value]) {
  //     NextResponse.error();
  //   }
  // });

  // Upsert building based on buildingName
  
  if (isCreation) {
    const building = await prisma.building.upsert({
      where: { buildingName: buildingName },
      update: {}, // No update operation required in this context
      create: {
        buildingName: buildingName,
      },
    });

    buildingId = building.id;

  }

  const room = await prisma.room.upsert({
    where: {
      buildingAndNumber: buildingAndNumber,
    },
    update: {
      floor,
      imageSrc,
      capacity,
      whiteboards,
      computers,
      projectors,
    },
    create: {
      buildingId,
      number,
      buildingAndNumber,
      floor,
      imageSrc,
      capacity,
      whiteboards,
      computers,
      projectors,
    },
  });

  return NextResponse.json(room);
}
