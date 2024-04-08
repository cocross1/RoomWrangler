"use client";

import qs from 'query-string';
import React, { useCallback, useMemo, useState } from "react";
import { parseISO, formatISO } from "date-fns";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories, buildings } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import BuildingSelect from "../inputs/BuildingSelect";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../inputs/Input";
import { SafeUser } from "@/app/types";
import { Room } from "@prisma/client";
import useSearchRoomsModal from "@/app/hooks/useSearchRoomsModal";

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
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.SPECIFIC);
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
      buildingAndNumber: "",
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

    if (!data.buildingAndNumber) {
      if (data.startTime === "") {
        toast.error("Unless you are searching for a specific room, you must select a start and end time.");
        return () => {};
      }
      if (data.endTime === "") {
        toast.error("Unless you are searching for a specific room, you must select an end time.");
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

    const url = qs.stringifyUrl({
      url: '/',
      query: data,
    }, { skipNull: true });

    console.log("data.startTime ", data.startTime, " data.endTime ", data.endTime);
    console.log('url ', url);

    reset();
    setIsLoading(false);
    setStep(STEPS.SPECIFIC);
    searchRoomsModal.onClose();
    router.push(url);
    toast.success("Search successful!");
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
      <Heading title="Do you have a particular room in mind?" 
      subtitle="To search for a specific room, enter the room name and skip over the next screens."/>
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
        <Heading title="When do you want to reserve a room?" />
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
        <Heading
          title="Add optional search filters."
          subtitle="What room features are you looking for?"
        />
        <Input
          id="whiteboards"
          label="Whiteboards"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="computers"
          label="Computers"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="projectors"
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
      secondaryAction={step === STEPS.SPECIFIC? undefined : onBack}
      title="Find Available Rooms"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default SearchRoomsModal;
