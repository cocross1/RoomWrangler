import prisma from '@/app/libs/prismadb';

export interface IReservationParams {
    startTime: string;
    endTime: string;
    whiteboards?: number;
    projectors?: number;
    computers?: number;
    capacity?: number;
}

export default async function getAvailableRooms(
    params: IReservationParams
) {
    try {
        const { startTime, endTime, whiteboards, projectors, computers, capacity } = params;

        let query: any = {};

        if (whiteboards) {
            query.whiteboards = {
                gte: +whiteboards
            }
        }

        if (projectors) {
            query.projectors = {
                gte: +projectors
            }
        }

        if (computers) {
            query.computers = {
                gte: +computers
            }
        }

        if (capacity) {
            query.capacity = {
                gte: +capacity
            }
        }

        // console.log('proj ', projectors);
        // console.log('sTR ', startTime, ' eTR ', endTime);

        if (startTime && endTime) {
            query.NOT = {
                reservations: {
                  some: {
                    AND: [
                      {
                        startTime: { lt: endTime }
                      },
                      {
                        endTime: { gt: startTime }
                      }
                    ]
                  }
                }
              }
        }

        const availableRooms = await prisma.room.findMany({
            where: query,
            orderBy: {
                buildingAndNumber: 'asc'
            }
        });

        return availableRooms;

    }
    catch (error: any) {
        throw new Error(error);
    }
}