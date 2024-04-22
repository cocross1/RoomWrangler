import { create } from 'zustand';

interface UploadRoomModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useUploadRoomModal = create<UploadRoomModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => {set({ isOpen: false})},
}));

export default useUploadRoomModal;