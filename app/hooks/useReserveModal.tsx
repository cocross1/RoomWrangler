import { create } from 'zustand';

interface ReserveModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useReserveModal = create<ReserveModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => {set({ isOpen: false})},
}));

export default useReserveModal;