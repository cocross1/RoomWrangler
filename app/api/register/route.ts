import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    const body = await request.json();
    const {
        email, password
    } = body;
    if (!email.endsWith("@davidson.edu")) {
        throw new Error('Use your Davidson email!');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: {
            email,
            hashedPassword
        }
    });
    return NextResponse.json(user);
}
