"use client";

import { SafeUser, SafeReservation } from "@/app/types";
import { Room, Reservation } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";
import useReserveModal from "@/app/hooks/useReserveModal";

interface RoomCardProps {
  data: Room;
  reservation?: SafeReservation; // changed Reservation to SafeReservation
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const RoomCard: React.FC<RoomCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const reserveModal = useReserveModal();
  // something that we won't use, but might be helpful/simialr to something we need in the future:
  // locationValue is a field stored on the Listing model (in the db)
  // const { getByValue } = useCountries();
  // const location = getByValue(data.locationValue);

  // breaks fn if room card is disabled
  // calls onAction if the action exists
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const reservationWindow = useMemo(() => {
    if (!reservation) {
      return null;
    }
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);

    return `${format(start, "Pp")} - ${format(end, "Pp")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/rooms/${data.id}`)}
      className="flex flex-col gap-2 w-full overflow-hidden rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <div className="w-full h-full">
        <div className="w-full relative overflow-hidden rounded-xl">
          <Image
            layout="responsive"
            width={500}
            height={200}
            alt="Room"
            src={data.imageSrc}
            className="object-cover group-hover:scale-110 transition"
          />
          {/* <div className="absolute top-3 right-3">
            <HeartButton roomId={data.id} currentUser={currentUser} />
          </div> */}
        </div>
        <div className="font-semibold text-lg text-center">{data.buildingAndNumber}</div>
        {onAction && actionLabel && (
            <Button disabled={disabled} small label={actionLabel} onClick={handleCancel}/>
        )}
      </div>
    </div>
  );
};
export default RoomCard;
