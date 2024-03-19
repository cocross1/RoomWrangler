'use client';

import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Button from "../Button";
import useReserveModal from "@/app/hooks/useReserveModal";

interface RoomHeadProps {
    title: string;
    imageSrc: string | null;
    id: string;
    currentUser?: SafeUser | null;
}

const RoomHead: React.FC<RoomHeadProps> = ({
    title, imageSrc, id, currentUser
}) => {
    const reserveModal = useReserveModal();

    // this is very broken i know but it is kinda sorta the rough steps of what we want
    // ... for now
    // an extra room name appears below the Reserve button haven't been able to figure out where it's coming from yet

    return (
        <div>
            <Heading title={title} subtitle="Reserve now"/>
        <div>
            <Button label="Reserve" onClick={reserveModal.onOpen} />
        </div>
        </div>
    );
}

export default RoomHead;