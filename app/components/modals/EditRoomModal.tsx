"use client";

import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../inputs/Input";
import useEditRoomModal from "@/app/hooks/useEditRoomModal";

enum STEPS {
  INFO = 0,
  IMAGES = 1,
}

const EditRoomModal = () => {
  const editRoomModal = useEditRoomModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.INFO);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({});

  let defaultImageSrc = editRoomModal.imageSrc;
  let imageSrc = watch("imageSrc");

  const handleCancel = () => {
    reset();
    setStep(STEPS.INFO);
    editRoomModal.onClose();
  };

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.IMAGES) {
      return onNext();
    }

    if (imageSrc === "") {
      toast.error("Please upload an image!");
      return () => {};
    }

    setIsLoading(true);

    data.buildingAndNumber = editRoomModal.buildingAndNumber;

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
      .post(`/api/rooms/${editRoomModal.roomId}`, data)
      .then(() => {
        toast.success("Room updated!");
        router.refresh();
        editRoomModal.onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      })
      .finally(() => {
        reset();
        setStep(STEPS.INFO);
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.IMAGES) {
      return "Save";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Update Room Info" />
      <Input
        id="floor"
        label="Floor"
        value={editRoomModal.floor}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="whiteboards"
        value={editRoomModal.whiteboards}
        label="Whiteboards"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="computers"
        value={editRoomModal.computers}
        label="Computers"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="projectors"
        value={editRoomModal.projectors}
        label="Projectors"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="capacity"
        value={editRoomModal.capacity}
        label="Capacity"
        disabled={isLoading}
        register={register}
        errors={errors}
        onChange={(value) => setCustomValue("capacity", value)}
      />
    </div>
  );
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Add a photo of the room." />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc?? defaultImageSrc}
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={editRoomModal.isOpen}
      onClose={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.INFO ? undefined : onBack}
      title="Edit This Room"
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default EditRoomModal;
