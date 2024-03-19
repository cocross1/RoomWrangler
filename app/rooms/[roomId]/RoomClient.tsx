'use client';

import { SafeUser } from "@/app/types";
import { Reservation, Room } from "@prisma/client";
import { useMemo } from "react";
import { categories } from '@/app/components/navbar/Categories';
import Container from "@/app/components/Container";
import RoomHead from "@/app/components/rooms/RoomHead";
import RoomInfo from "@/app/components/rooms/RoomInfo";

// might want to add Building here, or find some way to get the building name
interface RoomClientProps {
    reservations?: Reservation[];
    room: Room;
    currentUser?: SafeUser | null;
}

const RoomClient: React.FC<RoomClientProps> = ({
    room, currentUser
}) => {
    // need to update this since we're allowing multiple categories...
    // tried to modify to use .includes but it's complaining. or it was (?)
    const categoryList = useMemo(() => {
        return categories.find((item) => room.category.includes(item.label));
    }, [room.category]);
    return (
        <div>
            <Container>
                <div className="max-w-screen-lg mx-auto">
                    <div className="flex flex-col gap-6">
                        <RoomHead title={room.name} imageSrc={room.imageSrc} id={room.id} currentUser={currentUser}/>
                        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                            <RoomInfo projectors={room.projector} whiteboards={room.whiteboards} capacity={room.capacity} floor={room.floor} building={room.buildingId}/>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default RoomClient;