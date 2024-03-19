'use client';

import { SafeUser } from "@/app/types";

interface RoomInfoProps {
    user: SafeUser;
    whiteboards: number | null;
    projectors: number | null;
    capacity: number | null;
    floor: string | null;
    buildingId: string;
    // categories somehow?
    // also will need to modify buildingId / builidng depending on what we do
}

const RoomInfo: React.FC<RoomInfoProps> = ({


}) => {
    return (
        <div></div>
    );
}

export default RoomInfo;