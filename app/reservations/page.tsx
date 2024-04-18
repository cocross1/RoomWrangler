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

    // Ensures only future reservations are shown
    for (let i=0; i<reservations.length; i++){
        const currentDate = new Date();
        const reservationEnd = new Date(reservations[i].endTime);
        if (reservationEnd < currentDate){
            reservations.splice(i,1);
            // if (i != reservations.length-1){
            //     i--;
            // }
        }
    }

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