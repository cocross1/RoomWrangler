import prisma from '@/app/libs/prismadb';

export interface IReservationParams {
    startTimeRequested: string;
    endTimeRequested: string;
    whiteboards?: number;
    projectors?: number;
    computers?: number;
    capacity?: number;
}

export default async function getAvailableRooms(
    params: IReservationParams
) {
    try {
        const { startTimeRequested, endTimeRequested, whiteboards, projectors, computers, capacity } = params;

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

        if (startTimeRequested && endTimeRequested) {
            query.NOT = {
                reservations: {
                  some: {
                    OR: [
                      {
                        endTime: { gte: startTimeRequested },
                        startTime: { lte: startTimeRequested }
                      },
                      {
                        startTime: { lte: endTimeRequested },
                        endTime: { gte: endTimeRequested }
                      }
                    ]
                  }
                }
              }
        }

        const availableRooms = await prisma.room.findMany({
            where: query,
            orderBy: {
                buildingAndNumber: 'desc'
            }
        });

        return availableRooms;

    }
    catch (error: any) {
        throw new Error(error);
    }
}