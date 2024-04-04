'use client';

import axios from "axios";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";

import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeReservation, SafeUser } from "../types";
import RoomCard from "../components/rooms/RoomCard";

interface ReservationsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('')

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);
        axios.delete('/api/reservations/${id}') //working with
        .then(() => {
            toast.success('Reservation Cancelled');
            router.refresh();
        })
        .catch((error)=>{
            toast.error(error?.response?.data?.error);
        })
        .finally(()=>{
            setDeletingId('');
        })

    }, [router]);
    return (
        <Container>
            <Heading
                title = "Reservations"
                subtitle = "My Upcoming Reservations" //probs don't need
            />
            <div
                className ="
                mt-10
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-8
                "
            >
            {reservations.map((reservation)=>(
                <RoomCard
                    key = {reservation.id}
                    data = {reservation.room} // need work
                    reservation = {reservation}
                    actionId = {reservation.id}
                    onAction = {onCancel}
                    disabled = {deletingId == reservation.id}
                    actionLabel = "Cancel reservation"
                    currentUser = {currentUser}
                />
            ))}

            </div>
        </Container>
    );
}

export default ReservationsClient;