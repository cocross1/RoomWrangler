import prisma from "@/app/libs/prismadb";

export default async function getRooms() {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: {
                name: 'desc'
            }
        });
        return rooms;
    }
    catch (error: any) {
        throw new Error(error);
    }
}