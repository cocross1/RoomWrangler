import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import Heading from "../components/Heading";
import { IReservationParams } from "../actions/getRoomsByCriteriaOrName";
import Container from "../components/Container";
import RoomCard from "../components/rooms/RoomCard";
import getFavoriteRooms from "../actions/getFavoriteRooms";

interface FavoritesProps {
  searchParams: IReservationParams;
}

const FavoritesPage = async ({ params }: { params: FavoritesProps }) => {
  const currentUser = await getCurrentUser();
  let favoriteRooms = await getFavoriteRooms();
  if (favoriteRooms && favoriteRooms.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Looks like you don't have any favorites yet."
          subtitle="Try looking for a room that matches your exquisite taste."
          showReset
        />
      </ClientOnly>
    );
  }

  if (favoriteRooms && favoriteRooms.length > 0) {
    return (
      <ClientOnly>
        <Container>
          <div className="mt-10">
            <Heading title="Your Favorite Rooms" />
          </div>
          <div
            className="mt-10 
            grid grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-4"
          >
            {favoriteRooms.map((room: any) => {
              return (
                <RoomCard currentUser={currentUser} key={room.id} data={room} />
              );
            })}
          </div>
        </Container>
      </ClientOnly>
    );
  } else {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
};

export default FavoritesPage;
