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
    if(room && currentUser?.permissions === 'Admin') {
      editRoomModal.onOpen(room);
    }
    else {
      toast.error("Error accessing room features.");
    }
  }, [editRoomModal]);


  const onCalendar = useCallback(() => {
    if(reservations && room){
      calendarModal.onOpen(room.buildingAndNumber, reservations);
    }
    else
      toast.error("Error processing reservations. Please refresh.");
  }, [calendarModal]);

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
              />
            </div>
            <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
              <Button label="Reserve" onClick={onReserve} />
              <Button label="View Calendar" onClick={onCalendar}/>
              {currentUser?.permissions === 'Admin' && (
                <Button label="Edit Room" onClick={onEdit}/>
              )}
            </div>
            
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RoomClient;
