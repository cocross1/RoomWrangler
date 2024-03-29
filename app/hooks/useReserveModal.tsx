import { Reservation, Room } from '@prisma/client';
import { create } from 'zustand';

interface ReserveModalStore{
    isOpen: boolean;
    onOpen: (roomId: string, reservations:Reservation[]) => void;
    onClose: () => void;
    roomId: string;
    reservations:Reservation[];
}

const useReserveModal = create<ReserveModalStore>((set) => (
    {
    isOpen: false,
    roomId: '',
    reservations:[],
    onOpen: (roomID, reservations) => set({isOpen: true,
    roomId: roomID,
    reservations: reservations}),
    onClose: () => {set({ isOpen: false})},
}));

export default useReserveModal;