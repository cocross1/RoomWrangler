import { useCallback } from "react";
import getCurrentUser from "./actions/getCurrentUser";
import getRooms from "./actions/getRooms";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RoomCard from "./components/rooms/RoomCard";
import useSearchRoomsModal from "./hooks/useSearchRoomsModal";


export default async function Home() {
  const rooms = await getRooms();
  const currentUser = await getCurrentUser();

  const searchRoomsModal = useSearchRoomsModal();
  const onSearchRooms = useCallback(() => {
    searchRoomsModal.onOpen();
  }, [searchRoomsModal]);

  

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
        <div className="mt-40 
        grid grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-4">

            {rooms.map((room: any) => {
              return (
                <RoomCard currentUser={currentUser} key={room.id} data={room}/>
              )
            })}

        </div>
      </Container>
    </ClientOnly>
  );
}
