'use client';

import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Button from "../Button";
import Image from "next/image";
import useReserveModal from "@/app/hooks/useReserveModal";
import HeartButton from "../HeartButton";

interface RoomHeadProps {
    title: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
}

const RoomHead: React.FC<RoomHeadProps> = ({
    title, imageSrc, id, currentUser
}) => {
    const reserveModal = useReserveModal();

    // this is very broken i know but it is kinda sorta the rough steps of what we want
    // ... for now
    
    return (
        <div className="mt-20">
            <Heading title={title}/>
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative ">
                <Image alt="An image of the room." src={imageSrc} fill className="object-cover w-full"/>
                <div className="absolute top-5 right-5">
                    <HeartButton roomId={id} currentUser={currentUser}/>
                </div>
            </div>
        </div>
    );
}

export default RoomHead;