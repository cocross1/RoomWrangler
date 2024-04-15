import { Room } from "@prisma/client";
import { create } from "zustand";

interface EditRoomModalStore {
  roomId: string;
  number: string;
  floor: number;
  buildingAndNumber: string;
  whiteboards: number;
  projectors: number;
  computers: number;
  capacity: number;
  imageSrc: string;
  isOpen: boolean;
  onOpen: (room: Room) => void;
  onClose: () => void;
}

const useEditRoomModal = create<EditRoomModalStore>((set) => ({
  roomId: "",
  number: "",
  floor: 0,
  buildingAndNumber: "",
  whiteboards: 0,
  projectors: 0,
  computers: 0,
  capacity: 0,
  imageSrc: "",
  isOpen: false,
  onOpen: (room) => {
    console.log("opening w data: ", room.whiteboards);
    set({
      isOpen: true,
      roomId: room.id,
      number: room.number,
      floor: room.floor,
      buildingAndNumber: room.buildingAndNumber,
      whiteboards: room.whiteboards ? room.whiteboards : 0,
      projectors: room.projectors ? room.projectors : 0,
      computers: room.computers ? room.computers : 0,
      capacity: room.capacity ? room.capacity : 0,
      imageSrc: room.imageSrc,
    });
  },
  onClose: () => {
    set({
      isOpen: false,
      roomId: "",
      number: "",
      floor: 0,
      buildingAndNumber: "",
      whiteboards: 0,
      projectors: 0,
      computers: 0,
      capacity: 0,
      imageSrc: "",
    });
  },
}));

export default useEditRoomModal;
