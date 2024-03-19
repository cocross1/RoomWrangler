import prisma from '@/app/libs/prismadb';

interface IParams {
    roomId?: string;
}

export default async function getRoomById(
    params: IParams
) {
    try {
        const { roomId } = params;

        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            },
        });
        if (!room) {
            return null;
        }

        return room;
    }
    catch (error: any) {
        throw new Error(error);
    }
}