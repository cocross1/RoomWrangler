import getCurrentUser from "./actions/getCurrentUser";
import getRooms from "./actions/getRooms";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RoomCard from "./components/rooms/RoomCard";


export default async function Home() {
  const rooms = await getRooms();
  const currentUser = await getCurrentUser();

  if (rooms.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset/>
      </ClientOnly>
    )
  }
  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <div>
            {rooms.map((room: any) => {
              return (
                <RoomCard currentUser={currentUser} key={room.id} data={room}/>
              )
            })}
          </div>
        </div>
      </Container>
    </ClientOnly>
  );
}
