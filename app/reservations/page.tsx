import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import ReservationsClient from "./ReservationsClient"; 
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";


const ReservationsPage = async () => {
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

    //
    // for (const booking of reservations){
    //     const currentDate = new Date();
    //     const reservationEnd = new Date(booking.endTime);
    //     if (reservationEnd < currentDate){

    //     }
    // }

    if (reservations.length ==0){
        return(
            <ClientOnly>
                <EmptyState
                    title = "No reservations found"
                    subtitle = "Looks like you haven't reserved any rooms"
                />
            </ClientOnly>
        )
    }

    return(
        <ClientOnly>
            <ReservationsClient // changed from TripsClient
                reservations = {reservations}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default ReservationsPage;