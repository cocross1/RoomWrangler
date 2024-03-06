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

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back to Room Wrangler!"
            subtitle="Login With Davidson Credentials"/>
        <Input 
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />
        <Input 
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />
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
    body={bodyContent}/>
  )
}

export default LoginModal