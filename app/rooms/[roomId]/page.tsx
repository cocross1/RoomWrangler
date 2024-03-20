import getCurrentUser from "@/app/actions/getCurrentUser";
import getRoomById from "@/app/actions/getRoomById";
import getBuildingById from "@/app/actions/getBuildingById"
import Button from "@/app/components/Button";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import RoomClient from "./RoomClient";

interface IParams {
    roomId?: string;
    buildingId?: string;
}

const RoomPage = async ({params}: {params: IParams}) => {
    const currentUser = await getCurrentUser();
    const room = await getRoomById(params);
   // const building = await getBuildingById(params);
    if (!room) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }
    return (
        <div>
            <ClientOnly>
                <RoomClient room={room} currentUser={currentUser} />
            </ClientOnly>
        </div>
    );
}

export default RoomPage;