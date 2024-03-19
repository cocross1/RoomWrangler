"use client";

import { SafeUser } from "@/app/types";
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
  reservation?: Reservation;
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
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          {/* we left imageSrc as an optional attribute – need to specify a backup image URL here, if we do want to always render images */}
          <Image
            fill
            alt="Room"
            src={data.imageSrc || ""}
            className="object-cover h-full w-full group-hover:scale-110 transition"
          />
          <div className="absolute top-3 right-3">
            <HeartButton roomId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">{data.name}</div>
        <div className="font-light text-neutral-500">
          {reservationWindow || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
            {/* i added this part. currently directs you to a 404 error page on clicking the reserve button */}
         Placeholder
        </div>
        {onAction && actionLabel && (
            <Button disabled={disabled} small label={actionLabel} onClick={handleCancel}/>
        )}
      </div>
    </div>
  );
};
export default RoomCard;
