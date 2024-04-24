import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import ReservationsClient from "./ReservationsClient"; 
import getCurrentUser from "../actions/getCurrentUser";
import getReservationsByUserId from "../actions/getReservationsByUserId";


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

    const reservations = await getReservationsByUserId({userId: currentUser.id});
        if(reservations && reservations.length === 0){
        return (
            <ClientOnly>
            <EmptyState title="Looks like you haven't made any reservations yet." showReset />
          </ClientOnly>
          );
    }
    if (reservations){
        return(
            <ClientOnly>
                <ReservationsClient // changed from TripsClient
                    reservations = {reservations}
                    currentUser = {currentUser}
                />
            </ClientOnly>
        )
    }

    

        return(
            <ClientOnly>
                <EmptyState
                    title = "No reservations found"
                    subtitle = "Looks like you haven't reserved any rooms"
                />
            </ClientOnly>
        )
    
}

export default ReservationsPage;