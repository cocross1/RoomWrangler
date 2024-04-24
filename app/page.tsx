import getCurrentUser from "./actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RoomCard from "./components/rooms/RoomCard";
import getRoomsByCriteriaOrName, {
  IReservationParams,
} from "./actions/getRoomsByCriteriaOrName";

interface HomeProps {
  searchParams: IReservationParams;
}

const Home = async ({ searchParams }: HomeProps) => {

  const currentUser = await getCurrentUser();
  let availableRooms = await getRoomsByCriteriaOrName(searchParams);

  if (availableRooms && availableRooms.length > 0) {
    return (
      <ClientOnly>
        <Container>
          <div
            className="mt-10 
          grid grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-4"
          >
            {availableRooms.map((room: any) => {
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
        <EmptyState title="No exact matches." subtitle="Try modifying your search criteria." showReset />
      </ClientOnly>
    );
  }
};

export default Home;
