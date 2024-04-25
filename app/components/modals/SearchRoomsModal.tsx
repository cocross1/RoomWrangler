"use client";

import qs from "query-string";
import React, { useMemo, useState } from "react";
import { parseISO, formatISO } from "date-fns";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../inputs/Input";
import { SafeUser } from "@/app/types";
import useSearchRoomsModal from "@/app/hooks/useSearchRoomsModal";
import Subheader from "../Subheader";

interface SearchRoomsModalProps {
  currentUser?: SafeUser | null;
}

enum STEPS {
  SPECIFIC = 0,
  TIME = 1,
  FEATURES = 2,
}

const SearchRoomsModal: React.FC<SearchRoomsModalProps> = ({ currentUser }) => {
  const searchRoomsModal = useSearchRoomsModal();
  const router = useRouter();

  const [step, setStep] = useState(STEPS.SPECIFIC);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      buildingAndNumber: "",
      startTime: "",
      endTime: "",
      userId: currentUser?.id,
      whiteboards: 0,
      computers: 0,
      projectors: 0,
    },
  });

  const handleCancel = () => {
    reset();
    setStep(STEPS.SPECIFIC);
    searchRoomsModal.onClose();
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.FEATURES) {
      return onNext();
    }

    if (!data.buildingAndNumber) {
      if (data.startTime === "" || data.endTime === "") {
        toast.error(
          "Unless you are searching for a specific room, you must select a start and end time."
        );
        setStep(STEPS.TIME);
        return () => {};
      }

      setIsLoading(true);

      data.startTime = formatISO(parseISO(data.startTime), {
        representation: "complete",
      });
      data.endTime = formatISO(parseISO(data.endTime), {
        representation: "complete",
      });
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: data,
      },
      { skipNull: true }
    );

    reset();
    setIsLoading(false);
    setStep(STEPS.SPECIFIC);
    searchRoomsModal.onClose();
    try {
      router.push(url);
      toast.success("Search successful!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.FEATURES) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.SPECIFIC) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Subheader text="If you're looking for a specific room, enter the room name here. Leave all other fields blank." />
      <Input
        id="buildingAndNumber"
        label="ex: Building 100"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
    </div>
  );

  if (step === STEPS.TIME) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Subheader text="If you don't have a room in mind, you can enter a start and end time to see all rooms available during that window." />
        <Input
          id="startTime"
          label="Reservation Start Time"
          type="datetime-local"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="endTime"
          label="Reservation End Time"
          type="datetime-local"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.FEATURES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Subheader text="Filter search by desired room features. This step is optional." />
        <Input
          id="whiteboards"
          label="Whiteboards"
          disabled={isLoading}
          value="0"
          register={register}
          errors={errors}
        />
        <Input
          id="computers"
          label="Computers"
          disabled={isLoading}
          register={register}
          value="0"
          errors={errors}
        />
        <Input
          id="projectors"
          label="Projectors"
          disabled={isLoading}
          register={register}
          value="0"
          errors={errors}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchRoomsModal.isOpen}
      onClose={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.SPECIFIC ? undefined : onBack}
      title="Find Available Rooms"
      allowClose={true}
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default SearchRoomsModal;
