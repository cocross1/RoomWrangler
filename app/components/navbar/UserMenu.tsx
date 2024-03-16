'use client';
import React, { useCallback, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';
import useRentModal from '@/app/hooks/useRentModal';
import useReserveModal from '@/app/hooks/useReserveModal';

interface UserMenuProps{
    currentUser?: SafeUser | null
}


const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const reserveModal = useReserveModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() =>{
        setIsOpen((value)=>!value);
    },[]);

    const onReserve= useCallback(() => {
        reserveModal.onOpen();
    },[reserveModal]);

    const onRent= useCallback(() => {
        rentModal.onOpen();
    },[rentModal]);
  return (
    <div className="relative">
        <div className="flex flex-row items-center gap-3">
        <div onClick={onReserve} className ="
            hidden
            md:block
            text-sm
            font-semibold
            py-3
            px-4
            rounded-full
            hover: bg-neutral-100
            transition
            cursor-pointer">
                Reserve a Room
            </div>
            <div onClick={onRent} className ="
            hidden
            md:block
            text-sm
            font-semibold
            py-3
            px-4
            rounded-full
            hover: bg-neutral-100
            transition
            cursor-pointer">
                Upload a Room
            </div>
            <div onClick={toggleOpen}
            className="
            bg-gray-100
            p-4
            md:py-1
            md:px-2
            border-[1px]
            border-neutral-200
            flex
            flex-row
            items-center
            gap-3
            rounded-full
            cursor-pointer
            hover:shadow-md
            transition">
                <AiOutlineMenu />
                <div className="hidden md:block">
                    <Avatar src={currentUser?.image}/>
                </div>
            </div>
        </div>
        {isOpen && (<div className="
        absolute
        rounded-xl
        shadow-md
        w-[40vw]
        md:w-3/4
        bg-white
        overflow-hidden
        right-0
        top-12
        text-sm">
            <div className="flex flex-col cursor-pointer opacity-100">
                {currentUser ? (
                                        <>
                          <MenuItem
                              onClick={() => {}}
                              label="Upcoming Reservations" />
                      
                      <MenuItem
                              onClick={() => {}}
                              label="Favorite Rooms" />
                        <hr />
                        <MenuItem
                              onClick={() => signOut()}
                              label="Logout" />

                              </>

             )    : (
                    <>
                              <MenuItem
                                  onClick={loginModal.onOpen}
                                  label="Login" />
                          
                    </>
                )}
            </div>
        </div>

        )}
    </div>
  )
}

export default UserMenu