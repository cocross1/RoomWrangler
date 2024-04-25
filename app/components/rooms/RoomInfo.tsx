"use client";

import { Building } from "@prisma/client";

interface RoomInfoProps {
  whiteboards: number | null;
  projectors: number | null;
  capacity: number | null;
  floor: number | null;
  building?: Building;
}

const RoomInfo: React.FC<RoomInfoProps> = ({
  whiteboards,
  projectors,
  capacity,
  floor,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Room Features</div>
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>Floor: {floor}</div>
          <div>Whiteboards: {whiteboards}</div>
          <div>Projectors: {projectors}</div>
          <div>Capacity: {capacity}</div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
