'use client';

import React from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import {AiFillGithub} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import Button from '../Button';
const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const{
        register,
        handleSubmit,
        formState:{
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues:{
            email:'',
            password:''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false);
            if(callback ?. ok){
                toast.success('Logged in');
                router.refresh();
                loginModal.onClose();
            }
            if(callback?.error){
                toast.error(callback.error);

            }
        })
    }

    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
      }, [loginModal, registerModal])

    const bodyContent = (
        <div className=" flex flex-col gap-4">
            <div className="flex justify-center">
            <Heading  title="Welcome to Room Wrangler!"
            />
            </div>
                    <div className="flex flex-col gap-4 mt-3">
<div className="text-lg px-6 py-3 rounded-lg">
<Button outline
label="Log In with Google" 
icon={FcGoogle}
onClick={ () => {
    const result = signIn('google', { redirect: false });

    loginModal.isOpen = false;
    toast.success('Logged in!');
       // or your preferred callback URL
   
  }}
/>
</div>
</div>
        </div>
    )

  return (
    <Modal
    
    disabled={isLoading}
    isOpen={loginModal.isOpen}
    title="Log In"
    actionLabel="Continue"
    onClose={loginModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    />
  )
}

export default LoginModal