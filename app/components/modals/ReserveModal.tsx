"use client";

import React, { useState } from "react";
import { parseISO, formatISO } from "date-fns";
import Modal from "./Modal";
import useReserveModal from "@/app/hooks/useReserveModal";
import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "../inputs/Input";
import { SafeUser } from "@/app/types";

interface ReserveModalProps {
  currentUser?: SafeUser | null;
}

const ReserveModal: React.FC<ReserveModalProps> = ({ currentUser }) => {
  const reserveModal = useReserveModal();
  const roomId = reserveModal.roomId;
  const [reserveWeekly, setReserveWeekly] = useState(false);
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
      contactName: currentUser?.name,
      type: "",
      userId: currentUser?.id,
      roomId: roomId,
      displayName: "",
      weekly: false,
    },
  });

  const watchRoomId = watch("roomId");

  if (roomId != watchRoomId) {
    setValue("roomId", roomId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    data.startTime = formatISO(parseISO(data.startTime), {
      representation: "complete",
    });
    data.endTime = formatISO(parseISO(data.endTime), {
      representation: "complete",
    });
    data.weekly = reserveWeekly;
    axios
      .post("/api/reservations", data)
      .then(() => {
        toast.success("Reservation created!");
        reset();
        reserveModal.onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Something went wrong. Reload and double check the schedule to ensure no overlap has occured."
        );
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
        id="displayName"
        label="Enter Reservation Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required={true}
      />
      <Input
        id="type"
        label="Enter Reservation Type (eg. 'Academic Class')"
        disabled={isLoading}
        register={register}
        errors={errors}
        required={true}
      />
      {currentUser &&
        (currentUser.permissions === "Admin" ||
          currentUser.permissions === "Elevated Student" ||
          currentUser.permissions === "Professor") && (
          <div className="flex items-center justify-center w-full">
            <input
              id="reserveWeekly"
              type="checkbox"
              checked={reserveWeekly}
              onChange={(e) => setReserveWeekly(e.target.checked)}
              className="mr-2 transform scale-150"
            />
            <label htmlFor="reserveWeekly">
              Reserve weekly for the rest of the semester
            </label>
          </div>
        )}
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
