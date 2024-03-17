'use client'

import { SafeUser } from "@/app/types";
import { Room, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface RoomCardProps {
    data: Room,
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const RoomCard: React.FC<RoomCardProps> = ({
    data, reservation, onAction, disabled, actionLabel, actionId = "", currentUser
}) => {
    const router = useRouter();
    // breaks fn if room card is disabled
    // calls onAction if the action exists
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (disabled) {
                return;
            }
            onAction?.(actionId);
        }, [onAction, actionId, disabled]
    );


    return (
        <div>Room Card</div>
    );
}
export default RoomCard;