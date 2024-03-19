'use client';

import { SafeUser } from "@/app/types";
import { Reservation, Room } from "@prisma/client";
import { useMemo } from "react";
import { categories } from '@/app/components/navbar/Categories';
import Container from "@/app/components/Container";
import RoomHead from "@/app/components/rooms/RoomHead";

interface RoomClientProps {
    reservations?: Reservation[];
    room: Room;
    currentUser?: SafeUser | null;
}

const RoomClient: React.FC<RoomClientProps> = ({
    room, currentUser
}) => {
    const category = useMemo(() => {
        return categories.find((item) => item.label === room.category);
    }, [room.category]);
    return (
        <div>
            <Container>
                <div className="max-w-screen-lg mx-auto">
                    <div className="flex flex-col gap-6">
                        <RoomHead title={room.name} imageSrc={room.imageSrc} id={room.id} currentUser={currentUser}/>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default RoomClient;