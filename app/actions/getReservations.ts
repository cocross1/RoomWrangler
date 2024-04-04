import prisma from "@/app/libs/prismadb";

interface IParams {
    roomId?: string;
    userId?: string;
    //authorId?: string; // probs don't need
}

export default async function getReservations(
    params: IParams
){
    try{
        const { roomId, userId} = params;

        const query: any = {};

        if (roomId){
            query.roomId = roomId;
        }
        if (userId){
            query.userId = userId;
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include:{
                room: true,
            },
            orderBy: {
                startTime: 'desc' //changed from createdAt
            }
        });

        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startTime: reservation.startTime.toISOString(),
                endTime: reservation.endTime.toISOString(),
                room: reservation.room //changed
            })
        );

        return safeReservations;
    }catch (error :any){
        throw new Error(error);
    }
}