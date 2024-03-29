"use client";

import qs from 'query-string';
import React, { useCallback, useMemo, useState } from "react";
import { parseISO, formatISO } from "date-fns";
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

enum STEPS {
  TIME = 0,
  FEATURES = 1,
}

const SearchRoomsModal: React.FC<SearchRoomsModalProps> = ({ currentUser }) => {
  const searchRoomsModal = useSearchRoomsModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.TIME);
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
      whiteboards: 0,
      computers: 0,
      projectors: 0,
    },
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.FEATURES) {
      return onNext();
    }

    if (data.startTime === "") {
      toast.error("Please select a start time.");
      return () => {};
    }

    if (data.endTime === "") {
      toast.error("Please select an end time.");
      return () => {};
    }

    setIsLoading(true);

    data.startTime = formatISO(parseISO(data.startTime), {
      representation: "complete",
    });
    data.endTime = formatISO(parseISO(data.endTime), {
      representation: "complete",
    });

    // axios.post('/api/rooms', data)
    // .then(() => {
    //   toast.success('Room created!');
    //   router.refresh();
    //   reset();
    //   setStep(STEPS.CATEGORY)
    //   rentModal.onClose();
    // })
    // .catch((error) => {
    //   console.log(error);
    //   toast.error('Something went wrong.');
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // })
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.TIME);
    searchRoomsModal.onClose();
    router.push(url);
  }, 
  [
    step, 
    searchRoomsModal,  
    router, 
    onNext,
    bathroomCount,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.FEATURES) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.TIME) {
      return undefined;
    }
    return "Back";
  }, [step]);

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

  if (step === STEPS.FEATURES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add optional search filters."
          subtitle="What room features are you looking for?"
        />
        <Input
          id="whiteboards"
          type="number"
          label="Whiteboards"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="computers"
          type="number"
          label="Computers"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="projectors"
          type="number"
          label="Projectors"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchRoomsModal.isOpen}
      onClose={searchRoomsModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.TIME? undefined : onBack}
      title="Find Available Rooms"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default SearchRoomsModal;
