// 'use client';

// import { useState } from "react";
// import { FieldValues, useForm } from "react-hook-form";
// import Input from "../inputs/Input";
// import Button from "../Button";

// interface SearchSpecificRoomProps {
//   onSearch: (buildingAndNumber: string) => void;
// }

// const SearchSpecificRoom: React.FC<SearchSpecificRoomProps> = ({
//   onSearch,
// }) => {
//   const [specificSearchIsLoading, setSpecificSearchIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FieldValues>({
//     defaultValues: {
//       searchedRoom: "",
//     },
//   });

//   const handleClick = (e) => {
//     e.preventDefault();
//     handleSubmit(onSubmit)();
//   };

//   const onSubmit = async (data) => {
//     setSpecificSearchIsLoading(true);
//     await onSearch(data.searchedRoom);
//     setSpecificSearchIsLoading(false);
//   };

//   return (
//     <form>
//       <Input
//         id="searchedRoom"
//         label="Search for a specific room"
//         placeholder="Building and Room Number – ex. Building 100"
//         disabled={specificSearchIsLoading}
//         register={register}
//         errors={errors}
//       />
//       <Button
//         label="Search"
//         disabled={specificSearchIsLoading}
//         onClick={handleClick}
//       />
//     </form>
//   );
// };

// export default SearchSpecificRoom;
