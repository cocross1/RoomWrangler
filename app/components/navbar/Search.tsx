'use client';
import useSearchRoomsModal from '@/app/hooks/useSearchRoomsModal';
import React from 'react';
import { BiSearch } from 'react-icons/bi';

const Search = () => {
    const searchRoomsModal = useSearchRoomsModal();
  return (
    <div onClick={searchRoomsModal.onOpen}
    className="
    bg-gray-100
    border[1px]
    w-full
    md:w-auto
    py-2
    rounded-full
    shadow-sm
    hover:shadow-md
    transition
    cursor-pointer">
        <div className="flex 
        flex-row 
        items-center 
        justify-between">
            <div className="text-sm 
            font-semibold 
            px-6">
                Search for a Room
            </div>
            <div className="
            text-sm
            pl-6
            pr-2
            text-gray-600
            flex
            flex-row
            items-center
            gap-3">
                <div
                className="p-2
                bg-blue-500
                rounded-full
                text-white
                "><BiSearch size={18} /></div>
            </div>
        </div>
    </div>
  );
}

export default Search