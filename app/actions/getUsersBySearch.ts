import prisma from '@/app/libs/prismadb';

interface IParams {
    // userName?: string;
    // userEmail?: string;
}

export default async function getUsersBySearch(

) {
    try {
        // const { userName } = params;
        // const { userEmail } = params;

        const users = await prisma.user.findMany({
            orderBy: [
                {
                    name: 'asc',
                }
        ],
        });

        if (!users) {
            return null;
        }

        return users;
    }
    catch (error: any) {
        throw new Error(error);
    }
}