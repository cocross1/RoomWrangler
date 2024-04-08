import prisma from '@/app/libs/prismadb';

interface IParams {
    buildingAndNumber?: string;
}

export default async function getRoomByBuildingAndNumber(
    params: IParams
) {
    try {
        const { buildingAndNumber } = params;

        const room = await prisma.room.findUnique({
            where: {
                buildingAndNumber: buildingAndNumber
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