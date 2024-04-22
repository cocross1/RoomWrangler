import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getRooms() {
    try {
        // Assuming getCurrentUser() is async and returns the user object including favoriteIds
        const user = await getCurrentUser();
    
        if (!user) {
          throw new Error("User not found");
        }
    
        // If there are no favoriteIds, return an empty array early
        if (!user.favoriteIds || user.favoriteIds.length === 0) {
          return [];
        }
    
        const favoriteRooms = await prisma.room.findMany({
          where: {
            // Use the `id` field to filter rooms that are in user's favoriteIds
            id: {
              in: user.favoriteIds,
            },
          },
          orderBy: {
            buildingAndNumber: 'desc',
          },
        });
    
        return favoriteRooms;
      } catch (error: any) {
        throw new Error(error.message || "An error occurred while fetching favorite rooms.");
      }
}