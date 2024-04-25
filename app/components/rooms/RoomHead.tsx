'use client';

import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
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