import prisma from "@/app/libs/prismadb";

interface IParams {
    userId?: string;
}



export default async function getReservationsByUserId(
    params: IParams
) {
    try {
        const { userId } = params;

        const reservations = await prisma.reservation.findMany({
            where: {
                userId: userId
                
            },
            include:{
                room: true
            }

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
