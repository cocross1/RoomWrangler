import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import PastReservationsClient from "./PastReservationsClient";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";


const PastReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser){
        return (
            <ClientOnly>
                <EmptyState
                title = "Unauthorized"
                subtitle = "Please login"
                />
            </ClientOnly>
        )
    }
    const reservations = await getReservations({userId: currentUser.id});

    // Ensures only past reservations are shown
    const currentDate = new Date();
    const upcomingReservations = reservations.filter((reservation) => {
        const reservationEnd = new Date(reservation.endTime);
        return (reservationEnd<currentDate);
    });

    if (upcomingReservations.length ==0){
        return(
            <ClientOnly>
                <EmptyState
                    title = "No reservations found"
                    subtitle = "Looks like you don't have any past reservations"
                />
            </ClientOnly>
        )
    }

    return(
        <ClientOnly>
            <PastReservationsClient 
                reservations = {upcomingReservations}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default PastReservationsPage;