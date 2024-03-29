import prisma from '@/app/libs/prismadb';

interface IParams {
    roomId?: string;
}

export default async function getReservationsByRoomId(
    params: IParams
) {
    try {
        const { roomId } = params;

        const reservation = await prisma.reservation.findMany({
            where: {
                roomId: roomId
            },

        });
        if (!reservation) {
            return null;
        }

        return reservation;
    }
    catch (error: any) {
        throw new Error(error);
    }
}