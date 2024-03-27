"use client";

import React, { useMemo, useState } from "react";
import { parseISO, formatISO } from 'date-fns';
import Modal from "./Modal";
import useReserveModal from "@/app/hooks/useReserveModal";
import Heading from "../Heading";
import { categories, buildings } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import BuildingSelect from "../inputs/BuildingSelect";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../inputs/Input";
import { SafeUser } from "@/app/types";
import { Room } from "@prisma/client";
import useSearchRoomsModal from "@/app/hooks/useSearchRoomsModal";


interface SearchRoomsModalProps {
  currentUser?: SafeUser | null;
}

const SearchRoomsModal: React.FC<SearchRoomsModalProps> = ({ currentUser }) => {
  const searchRoomsModal = useSearchRoomsModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      startTime: "",
      endTime: "",
      userId: currentUser?.id,
    },
  });


  const onSubmit: SubmitHandler<FieldValues> = (data) => {

     setIsLoading(true);
     data.startTime = formatISO(parseISO(data.startTime), { representation: 'complete' });
     data.endTime = formatISO(parseISO(data.endTime), { representation: 'complete' });

    // somehow call (can't do it here) the getAvailableRooms fn

  }

 
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="When do you want to reserve a room?" />
      <Input
        id="startTime"
        label="Reservation Start Time"
        type="datetime-local"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="endTime"
        label="Reservation End Time"
        type="datetime-local"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

    </div>
  );

  return (
    <Modal
      isOpen={searchRoomsModal.isOpen}
      onClose={searchRoomsModal.onClose}
      onSubmit={
        handleSubmit(onSubmit)}
      actionLabel="Search"
      title="Search For Available Rooms"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default SearchRoomsModal;
