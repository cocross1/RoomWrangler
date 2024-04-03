import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

interface IParams {
  newPermissions: string;
  userId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const {userId, newPermissions } = await request.json();


  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        permissions: newPermissions, // Adjusted to update permissions field
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    // Handle potential errors, such as "user not found" or Prisma errors
    console.error("Failed to update user permissions:", error);
    return new Response("Error updating user permissions", { status: 500 });
  }
}

