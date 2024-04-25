"use client";

import { SafeUser } from "@/app/types";
import { User } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import useReserveModal from "@/app/hooks/useReserveModal";
import useCalendarModal from "@/app/hooks/useCalendar";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../components/inputs/Input";
import UserCard from "../components/users/UserCard";

interface PermissionsClientProps {
  currentUser?: SafeUser | null;
  users?: User[] | null;
}

const PermissionsClient: React.FC<PermissionsClientProps> = ({
  currentUser,
  users,
}) => {
  const router = useRouter();

  if (!currentUser || currentUser.permissions !== "Admin") {
    router.push("/");
  }

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      userName: "",
      userEmail: "",
    },
  });

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  let inputName = watch("userName");
  let inputEmail = watch("userEmail");

  const handleSearch = () => {
    setNameSearch(inputName);
    setEmailSearch(inputEmail);
  };

  return (
    <div>
      <Container>
        <div>
          <div
            className="relative
        top-0
        w-2/3
        "
          >
            Search by Name
            <Input
              id="userName"
              label="Search for a user by name."
              disabled={isLoading}
              register={register}
              errors={errors}
              required={true}
            />
          </div>
          <div
            className="relative
        top-3
        w-2/3
        "
          >
            Search by Email
            <Input
              id="userEmail"
              label="Search for a user by email."
              disabled={isLoading}
              register={register}
              errors={errors}
              required={true}
            />
          </div>
        </div>
        <div
          className="mt-10 
        flex 
        flex-row 
        items-center 
        gap-4 
        font-light 
        text-neutral-500
        "
        >
          <Button label="Search for User" onClick={handleSearch} />
        </div>
        <hr className="mt-5"></hr>
        <div>
          {users &&
            users
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
                  user.email.toLowerCase().includes(emailSearch.toLowerCase())
              )
              .map((user) => <UserCard key={user.id} data={user} />)}
        </div>
      </Container>
    </div>
  );
};

export default PermissionsClient;
