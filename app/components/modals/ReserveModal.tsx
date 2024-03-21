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


interface ReserveModalProps {
  currentUser?: SafeUser | null;
}

const ReserveModal: React.FC<ReserveModalProps> = ({ currentUser }) => {
  const reserveModal = useReserveModal();
  const roomId = reserveModal.roomId;
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
      roomId: roomId,
      name: currentUser?.name,
    },
  });
  //const startTime = watch('startTime');
  const endTime = watch('endTime');
  const watchRoomId = watch('roomId');
  if(roomId != watchRoomId){
    setValue('roomId', roomId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }



  const onSubmit: SubmitHandler<FieldValues> = (data) => {

     setIsLoading(true);
     data.startTime = formatISO(parseISO(data.startTime), { representation: 'complete' });
     data.endTime = formatISO(parseISO(data.endTime), { representation: 'complete' });

    axios
      .post("/api/reservations", data)
      .then(() => {
        toast.success("Reservation created!");
        router.refresh();
        reset();
        reserveModal.onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  }

 
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Enter details about your reservation." />
      <Input
        id="startTime"
        label="Start Time"
        type="datetime-local"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="endTime"
        label="End Time"
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
      isOpen={reserveModal.isOpen}
      onClose={reserveModal.onClose}
      onSubmit={
        handleSubmit(onSubmit)}
      actionLabel="Reserve"
      title="Reserve This Room"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default ReserveModal;
