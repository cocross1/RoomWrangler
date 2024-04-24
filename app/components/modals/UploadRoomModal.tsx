"use client";

import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import useUploadRoomModal from "@/app/hooks/useUploadRoomModal";
import { buildings } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../inputs/Input";
import Subheader from "../Subheader";

enum STEPS {
  BUILDING = 0,
  INFO = 1,
  IMAGES = 2,
}

const UploadRoomModal = () => {
  const uploadRoomModal = useUploadRoomModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.BUILDING);
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
      buildingName: "",
      number: "",
      floor: 0,
      imageSrc: "",
      capacity: 0,
      whiteboards: 0,
      computers: 0,
      projectors: 0,
    },
  });

  // required fields
  let building = watch("building");
  let number = watch("number");
  let imageSrc = watch("imageSrc");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleCancel = () => {
    reset();
    setStep(STEPS.BUILDING);
    uploadRoomModal.onClose();
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.BUILDING) {
      if (!building || !number) {
        toast.error("You must complete all fields.");
        return;
      }
    }
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.IMAGES) {
      return onNext();
    }

    if (imageSrc === "") {
      toast.error("You must upload an image.");
      return () => {};
    }

    setIsLoading(true);

    if (data.building && data.number) {
      const buildingAndNumber = `${data.building} ${data.number}`;
      data.buildingAndNumber = buildingAndNumber;
    }
    if (data.floor) {
      const floorInt = parseInt(data.floor, 10);
      data.floor = floorInt;
    }
    if (data.whiteboards) {
      const whiteboardsInt = parseInt(data.whiteboards, 10);
      data.whiteboards = whiteboardsInt;
    }
    if (data.projectors) {
      const projectorsInt = parseInt(data.projectors, 10);
      data.projectors = projectorsInt;
    }
    if (data.computers) {
      const computersInt = parseInt(data.computers, 10);
      data.computers = computersInt;
    }
    if (data.capacity) {
      const capacityInt = parseInt(data.capacity, 10);
      data.capacity = capacityInt;
    }

    axios
      .post("/api/rooms", data)
      .then(() => {
        toast.success("Room created!");
        router.refresh();
        uploadRoomModal.onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      })
      .finally(() => {
        reset();
        setStep(STEPS.BUILDING);
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.IMAGES) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.BUILDING) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Subheader text="Enter the building name, room number, and floor. This step is required." />
      <div
        className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto"
      >
        {buildings.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(building) => setCustomValue("building", building)}
              selected={building === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
      <Input
        id="number"
        label="Room Number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required={true}
      />
      <Input
          id="floor"
          label="Floor"
          disabled={isLoading}
          register={register}
          errors={errors}
          required={true}
        />
    </div>
  );
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Subheader text="Add additional information about the room. This step is optional." />
        <Input
          id="whiteboards"
          label="Whiteboards"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="computers"
          label="Computers"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="projectors"
          label="Projectors"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="capacity"
          label="Capacity"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Subheader text="Add a photo of the room. This step is required."/>
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={uploadRoomModal.isOpen}
      onClose={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.BUILDING ? undefined : onBack}
      title="Upload a Room"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default UploadRoomModal;
