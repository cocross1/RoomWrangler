import getCurrentUser from "@/app/actions/getCurrentUser";
import getRoomById from "@/app/actions/getRoomById";
import Button from "@/app/components/Button";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import RoomClient from "./RoomClient";

interface IParams {
    roomId?: string;
}

const RoomPage = async ({params}: {params: IParams}) => {
    const currentUser = await getCurrentUser();
    const room = await getRoomById(params);

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
                <RoomClient room={room} currentUser={currentUser}/>
            </ClientOnly>
            {room.name}
        </div>
    );
}

export default RoomPage;