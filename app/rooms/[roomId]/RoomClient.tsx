"use client";

import { SafeUser } from "@/app/types";
import { Reservation, Room, Building } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { categories } from "@/app/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import Container from "@/app/components/Container";
import RoomHead from "@/app/components/rooms/RoomHead";
import RoomInfo from "@/app/components/rooms/RoomInfo";
import Button from "@/app/components/Button";
import useReserveModal from "@/app/hooks/useReserveModal";
import useCalendarModal from "@/app/hooks/useCalendar";
import useEditRoomModal from "@/app/hooks/useEditRoomModal";

const initialReservationWindow = {
  startTime: new Date(),
  endTime: new Date(),
  key: "selection",
};

// might want to add Building here, or find some way to get the building name
interface RoomClientProps {
  reservations?: Reservation[];
  room: Room;
  building?: Building;
  currentUser?: SafeUser | null;
  // reservation? = Reservation[];
}

const RoomClient: React.FC<RoomClientProps> = ({ room, currentUser, reservations, building }) => {
  const buildingAndNumber = `${room.buildingAndNumber}`;
  // need to update this since we're allowing multiple categories...
  // tried to modify to use .includes but it's complaining. or it was (?)
  const router = useRouter();
  const loginModal = useLoginModal();
  const reserveModal = useReserveModal();
  const editRoomModal = useEditRoomModal();
  const calendarModal =  useCalendarModal();
  const onReserve = useCallback(() => {
    if(reservations){
      reserveModal.onOpen(room.id, reservations);
      console.log(reservations);
    }
    else
      toast.error("Error processing reservations, please refresh.");
  }, [reserveModal]);

  const onEdit = useCallback(() => {
    console.log(room.buildingAndNumber);
    console.log(currentUser?.permissions);
    if(room && currentUser?.permissions === 'Admin') {
      console.log("made it");
      editRoomModal.onOpen(room);
    }
    else {
      toast.error("Error accessing room features.");
    }
  }, [editRoomModal]);



  const [isLoading, setIsLoading] = useState(false);
  const [reservationWindow, setReservationWindow] = useState(
    initialReservationWindow
  );

  const onCalendar = useCallback(() => {
    if(reservations && room){
      calendarModal.onOpen(room.buildingAndNumber, reservations);
    }
    else
      toast.error("Error Processing Reservations, Please Refresh");
  }, [calendarModal]);

  // const onCreateReservation = useCallback(() => {
  //   if (!currentUser) {
  //     return loginModal.onOpen();
  //   }
  //   setIsLoading(true);
  //   axios
  //     .post("/api/reservations", {
  //       startTime: reservationWindow.startTime,
  //       endTime: reservationWindow.endTime,
  //       roomId: room?.id,
  //     })
  //     .then(() => {
  //       toast.success("Room reserved!");
  //       setReservationWindow(initialReservationWindow);
  //       router.refresh();
  //     })
  //     .catch(() => {
  //       toast.error("Something went wrong.");
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [
  //   reservationWindow,
  //   room?.id,
  //   router,
  //   currentUser,
  //   loginModal,
  //   reserveModal,
  // ]);
  // const categoryList = useMemo(() => {
  //     return categories.find((item) => room.category.includes(item.label));
  // }, [room.category]);
  return (
    <div>
      <Container>
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-6">
            <RoomHead
              title={buildingAndNumber}
              imageSrc={room.imageSrc}
              id={room.id}
              currentUser={currentUser}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
              <RoomInfo
                projectors={room.projectors}
                whiteboards={room.whiteboards}
                capacity={room.capacity}
                floor={room.floor}
             //   buildingId={room.buildingId}
              />
            </div>
            <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
              <Button label="Reserve" onClick={onReserve} />
              <Button label="View Calendar" onClick={onCalendar}/>
              <Button label="Edit Room" onClick={onEdit}/>
            </div>
            
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RoomClient;
