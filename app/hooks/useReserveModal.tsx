import { create } from 'zustand';

interface ReserveModalStore{
    isOpen: boolean;
    onOpen: (roomId: string) => void;
    onClose: () => void;
    roomId: string
}

const useReserveModal = create<ReserveModalStore>((set) => ({
    isOpen: false,
    roomId: '',
    onOpen: (roomID) => set({isOpen: true,
    roomId: roomID}),
    onClose: () => {set({ isOpen: false})},
}));

export default useReserveModal;