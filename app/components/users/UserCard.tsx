"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../Button";
import DropdownBox from "../inputs/DropdownBox";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export const roles = ["Professor", "Student", "Elevated Student", "Admin"];

interface UserCardProps {
  data: User;
}

const UserCard: React.FC<UserCardProps> = ({ data }) => {
  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      id: data.id,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  let value = watch(data.id);

  const handlePermissionsChange = () => {
    setIsLoading(true);

    axios
      .post("/api/permissions", { userId: data.id, newPermissions: value })
      .then(() => {
        toast.success("Permissions updated!");
        reset();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong. Reload and try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
        <div className="w-2/3 pl-2 font-semibold text-lg">{data.name}</div>
      </div>
      {value &&
        ((!data.permissions &&
          value !== "Student" &&
          value !== data.permissions) ||
          (data.permissions && value !== data.permissions)) && (
          <div className="w-1/3">
            <Button
              label={"Update User Permissions"}
              onClick={() => handlePermissionsChange()}
            />
          </div>
        )}

      <DropdownBox
        id={data.id}
        register={register}
        options={roles}
        startVal={data.permissions ? data.permissions : "Student"}
      />
    </div>
  );
};
export default UserCard;
