import prisma from '@/app/libs/prismadb';

interface IParams {
    buildingId?: string;
}

export default async function getRoomById(
    params: IParams
) {
    try {
        const { buildingId } = params;

        const building = await prisma.building.findUnique({
            where: {
                id: buildingId
            },
        });
        if (!building) {
            return null;
        }

        return building;
    }
    catch (error: any) {
        throw new Error(error);
    }
}