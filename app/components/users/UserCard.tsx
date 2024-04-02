"use client";

import { SafeUser } from "@/app/types";
import { Room, Reservation, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";
import useReserveModal from "@/app/hooks/useReserveModal";
import DropdownBox from "../inputs/DropdownBox";
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm } from "react-hook-form";

export const roles = [
'Professor',
 'Student',
'Elevated Student',  
'Admin'
]


interface UserCardProps {
  data: User;

}

const UserCard: React.FC<UserCardProps> = ({
  data
}) => {
  const router = useRouter();
  const{
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
        errors,
    },
    reset
}=useForm<FieldValues>({
    defaultValues:{
      id:data.id
    }
});

  let value = watch(data.id);
  if(value !== data.permissions){
    console.log("we are out here!")
  }

  return (
    <div
    onClick={() => {}}
    className="flex flex-row items-center justify-between gap-3 md:gap-0 w-full hover:bg-gray-400 transition-transform duration-200 p-2"
  >
    <div className="flex items-center"> 
      <div className="w-1/3 relative overflow-hidden rounded-xl">
        <Image
          layout="responsive"
          width={500}
          height={200}
          alt={data.name}
          src={data.image}
          className="object-cover"
        />
      </div>
      <div className="w-2/3 pl-2 font-semibold text-lg">
        {data.name}
      </div>

    </div>
          <DropdownBox id={data.id} register={register} onChange={()=>{}} options={roles} startVal={data.permissions? data.permissions : "Student"} />
  </div>
  
  );
};
export default UserCard;
