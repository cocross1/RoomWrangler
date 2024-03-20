"use client";

import React, { useMemo, useState } from "react";
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
      name: "",
      type: "",
    },
  });

  // let category=watch('category');
  // let building = watch('buildingName');
  // let floor = watch('floor');
  // let capacity = watch('capacity');
  // let whiteboards = watch('whiteboards');
  // let computers = watch('computers');
  // let projector = watch('projector');
  // let imageSrc= watch('imageSrc');
  // const setCustomValue = (id: string, value: any) =>{

  //     if(id==='category'){
  //         console.log(value);
  //     // Correctly use watch to get the current state of category
  //     const currentCategories = watch('category'); // Ensure this is an array

  //     const isSelected = currentCategories.includes(value);
  //     console.log('here');

  //     if (isSelected) {
  //         // If already selected, remove it from the array
  //         console.log("Removing category: " + value);
  //         setValue('category', currentCategories.filter((category: String[]) => category !== value), {
  //             shouldDirty: true,
  //             shouldTouch: true,
  //             shouldValidate: true,
  //         });
  //     } else {
  //         // If not selected, add it to the array
  //         console.log("Adding category: " + value);
  //         setValue('category', [...currentCategories, value], {
  //             shouldDirty: true,
  //             shouldTouch: true,
  //             shouldValidate: true,
  //         });
  //     }

  //     }else{
  //     setValue(id, value, {
  //         shouldDirty: true,
  //         shouldTouch: true,
  //         shouldValidate: true,
  //     })}
  // }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log('dst type of', typeof data.startTime);
    const reservationData = {...data, userId: currentUser?.id, roomId: reserveModal.roomId};

    axios
      .post("/api/reservations", reservationData)
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
  };

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
      <Input
        id="name"
        label="Name (Optional)"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="type"
        label="Type (Optional)"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
    </div>
  );

  return (
    <Modal
      isOpen={reserveModal.isOpen}
      onClose={reserveModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Reserve"
      title="Reserve This Room"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default ReserveModal;
