"use client";

import { SafeUser } from "@/app/types";

interface RoomInfoProps {
  user: SafeUser;
  whiteboards: number | null;
  projectors: number | null;
  capacity: number | null;
  floor: number | null;
  buildingId: string;
  // categories somehow?
  // also will need to modify buildingId / builidng depending on what we do
}

const RoomInfo: React.FC<RoomInfoProps> = ({
  user,
  whiteboards,
  projectors,
  capacity,
  floor,
  buildingId,
}) => {

    let floorText;
    if (floor == 0) {
        floorText = 'Basement';
    }
     else if (floor == 1) {
        floorText = '1st Floor'
    }
    else if (floor == 2) {
        floorText = '2nd Floor';
    }
    else if (floor == 3) {
        floorText = '3rd Floor';
    }
    else {
        floorText = floor;
    }

  return (
  <div className="col-span-4 flex flex-col gap-8">
    <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
            <div>{buildingId}</div>
            <div>{floorText}</div>
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
            <div>{whiteboards} whiteboards</div>
            <div>{projectors} projectors</div>
            <div>{capacity} capacity</div>
        </div>
    </div>
  </div>
  );
};

export default RoomInfo;
