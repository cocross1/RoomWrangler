import { create } from 'zustand';

interface SearchRoomsModalStore{
    isOpen: boolean;
    onOpen: (roomId: string) => void;
    onClose: () => void;
}

const useSearchRoomsModal = create<SearchRoomsModalStore>((set) => ({
    isOpen: false,
    roomId: '',
    onOpen: () => {set({isOpen: true})},
    onClose: () => {set({ isOpen: false})},
}));

export default useSearchRoomsModal;