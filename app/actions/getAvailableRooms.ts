import prisma from '@/app/libs/prismadb';

// not sure about the type of this object
// also might need to make it a safe type??
interface IParams {
    startTimeRequested: Date;
    endTimeRequested: Date;
}

export default async function getAvailableRooms(
    params: IParams
) {
    try {
        const { startTimeRequested, endTimeRequested } = params;

        // find the reservations that conflict
        const conflictingReservations = await prisma.reservation.findMany({
            where: {
                OR: [
                    {
                        AND: 
                        [
                            { startTime: { lt: endTimeRequested } },
                            { endTime: { gt: startTimeRequested } }
                        ]
                    },
                    {
                        AND:
                        [
                            { startTime: { gte: startTimeRequested } },
                            { endTime: { lte: endTimeRequested } }
                        ]
                    }
                ]
            },
            select: {
                roomId: true
            }
        });

        // then discard the rooms associated with those reservations
        const unavailableRoomIds = conflictingReservations.map(reservation => reservation.roomId);

        // and return all remaining rooms
        const availableRooms = await prisma.room.findMany({
            where: {
                NOT: {
                    id: {in: unavailableRoomIds}
                }
            }
        });

        return availableRooms;


    }
    catch (error: any) {
        throw new Error(error);
    }
}