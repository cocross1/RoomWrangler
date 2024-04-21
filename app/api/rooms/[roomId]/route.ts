import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  roomId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const { roomId } = params;

    if (!roomId || typeof roomId != "string") {
      throw new Error("Invalid room ID");
    }

    const body = await request.json();

    const {
      buildingAndNumber,
      floor,
      whiteboards,
      capacity,
      projectors,
      computers,
    } = body;

    if (!roomId || !buildingAndNumber || !floor) {
      throw new Error("Missing required fields.");
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId, buildingAndNumber: buildingAndNumber },
    });

    if (!room) {
      throw new Error("Room not found.");
    }

    let updateData = {
      floor: floor !== room.floor ? floor : room.floor,
      whiteboards:
        whiteboards !== room.whiteboards ? whiteboards : room.whiteboards,
      capacity: capacity !== room.capacity ? capacity : room.capacity,
      projectors: projectors !== room.projectors ? projectors : room.projectors,
      computers: computers !== room.computers ? computers : room.computers,
    };

    console.log("here?");

    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
        buildingAndNumber: buildingAndNumber,
      },
      data: updateData,
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Something went wrong");
  }
}
