import { create } from 'zustand';

interface SearchRoomsModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useSearchRoomsModal = create<SearchRoomsModalStore>((set) => ({
    isOpen: false,
    onOpen: () => {set({isOpen: true})},
    onClose: () => {set({ isOpen: false})},
}));

export default useSearchRoomsModal;