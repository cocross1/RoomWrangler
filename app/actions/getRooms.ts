import prisma from "@/app/libs/prismadb";

export default async function getRooms() {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: [
                {
                    building: 'asc',
                },
                {
                    number: 'asc',
                }
        ],
        });
        return rooms;
        // note!! Don't directly pass data from a server component to a client component (ex. RoomCard), 
        // unless it's a plain type. Date types are not supported like this.
        // if we end up needing to do that, review ~5:40:00 in tutorial for how to convert it to a safe type!
    }
    catch (error: any) {
        throw new Error(error);
    }
}