import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import PermissionsClient from "./PermissionsClient";
import Heading from "../components/Heading";
import getUsersBySearch from "../actions/getUsersBySearch";

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

            </ClientOnly>
        </div>
    );
}

export default PermissionsPage;