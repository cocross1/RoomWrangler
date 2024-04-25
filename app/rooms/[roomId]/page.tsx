import getCurrentUser from "@/app/actions/getCurrentUser";
import getRoomById from "@/app/actions/getRoomById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import RoomClient from "./RoomClient";
import getReservationsByRoomId from "@/app/actions/getReservationsByRoomId";

interface IParams {
  roomId?: string;
  buildingId?: string;
}

const RoomPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const room = await getRoomById(params);
  const reservations = await getReservationsByRoomId({
    roomId: room ? room.id : undefined,
  });
  if (!room) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <div>
      <ClientOnly>
        <RoomClient
          reservations={reservations ? reservations : undefined}
          room={room}
          currentUser={currentUser}
        />
      </ClientOnly>
    </div>
  );
};

export default RoomPage;
