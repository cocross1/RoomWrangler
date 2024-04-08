import { useCallback, useEffect, useState } from "react";
import getCurrentUser from "./actions/getCurrentUser";
import getRooms from "./actions/getRooms";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RoomCard from "./components/rooms/RoomCard";
import getRoomsByCriteriaOrName, {
  IReservationParams,
} from "./actions/getRoomsByCriteriaOrName";
import Input from "./components/inputs/Input";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface HomeProps {
  searchParams: IReservationParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  // const [currentUser, setCurrentUser] = useState(null);
  // const [availableRooms, setAvailableRooms] = useState([]);
  const currentUser = await getCurrentUser();
  let availableRooms = await getRoomsByCriteriaOrName(searchParams);
  console.log("sP ", searchParams);

  // const handleSpecificRoomSearch = async (buildingAndNumber: string) => {
  //   try {
  //     const specificRoom = await getRoomByBuildingAndNumber({buildingAndNumber: buildingAndNumber});
  //     availableRooms = specificRoom? [specificRoom] : [];
  //   }
  //   catch (error) {
  //     toast.error("Something went wrong");
  //     console.error("Failed to find room.");
  //   }
  // }


  
  // const handleSearchSubmit = async (searchCriteria) => {
  //   setSearchSubmitted(true);
  //   try {
  //     const availableRooms = await getAvailableRooms(searchCriteria);
  //     setRooms(availableRooms);
  //   } catch (error) {
  //     console.error("Failed to fetch available roms: ", error);
  //   }
  // };

  if (availableRooms && availableRooms.length > 0) {
    return (
      <ClientOnly>
        <Container>
          <div
            className="mt-10 
          grid grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-4"
          >
            {availableRooms.map((room: any) => {
              return (
                <RoomCard currentUser={currentUser} key={room.id} data={room} />
              );
            })}
          </div>
        </Container>
      </ClientOnly>
    );
  } else {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
};

export default Home;
