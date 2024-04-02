import getCurrentUser from "@/app/actions/getCurrentUser";
import getRoomById from "@/app/actions/getRoomById";
import getBuildingById from "@/app/actions/getBuildingById"
import Button from "@/app/components/Button";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getReservationsByRoomId from "@/app/actions/getReservationsByRoomId";
import PermissionsClient from "./PermissionsClient";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import getUsersBySearch from "../actions/getUsersBySearch";
import UserCard from "../components/users/UserCard";

interface IParams {
    roomId?: string;
    buildingId?: string;
}

const PermissionsPage = async ({params}: {params: IParams}) => {
    const currentUser = await getCurrentUser();
    const users = await getUsersBySearch();
    return (
        <div>
            <ClientOnly>
                <div className="max-w-screen-lg mx-auto 
                flex flex-col gap-6
                mt-10">
                    <Heading title="Permissions"/>
                </div>
                <div >
                    <PermissionsClient currentUser={currentUser} users={users}/>
                </div>
                <div>

                {users && users.map((user: any) => {
              return (
                <UserCard data={user}/>
              )
            })}
                </div>
            </ClientOnly>
        </div>
    );
}

export default PermissionsPage;