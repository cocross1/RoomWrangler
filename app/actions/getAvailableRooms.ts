import prisma from '@/app/libs/prismadb';

// find the reservations that conflict
// then store the rooms associated with those reservations
// then 

interface IParams {
    startTimeRequested: Date;
    endTimeRequested: Date;
}

export default async function getAvailableRooms(
    params: IParams
) {
    try {
        const { startTimeRequested, endTimeRequested } = params;

        const conflictingReservations = await prisma.reservation.findMany({
            where: {
                startTime: {
                    gte: startTimeRequested,
                },
                endTime: {
                    gte: endTimeRequested,
                }
            },
        });
        if (!reservations) {
            return null;
        }

        return reservations;
    }
    catch (error: any) {
        throw new Error(error);
    }
}