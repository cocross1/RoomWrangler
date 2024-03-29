import { Reservation } from '@prisma/client';
import { create } from 'zustand';

interface CalendarStore{
    isOpen: boolean;
    onOpen: (roomId: string, reservations:Reservation[]) => void;
    onClose: () => void;
    buildingAndNumber: string;
    reservations:Reservation[];
}

const useCalendar = create<CalendarStore>((set) => ({
    isOpen: false,
    buildingAndNumber: '',
    reservations:[],
    onOpen: (buildingAndNumber, reservations) => set({isOpen: true,
    buildingAndNumber: buildingAndNumber,
    reservations: reservations}),
    onClose: () => {set({ isOpen: false})},
}));

export default useCalendar;