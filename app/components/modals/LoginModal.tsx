"use client";

import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import { toast } from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { SafeUser } from "@/app/types";

interface LoginModalProps {
  currentUser?: SafeUser | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loginModal.isOpen && currentUser !== null) {
      loginModal.onClose();
    }
  }, [loginModal, currentUser]);

  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <div className="flex justify-center">
        <Heading title="Welcome to Room Wrangler!" />
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <div className="text-lg px-6 py-3 rounded-lg">
          <Button
            outline
            label="Log In with Google"
            icon={FcGoogle}
            onClick={() => {
              const result = signIn("google", { redirect: false });
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      allowClose={false}
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Log In"
      onClose={loginModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
    />
  );
};

export default LoginModal;
