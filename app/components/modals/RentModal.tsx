'use client'

import React, { useMemo, useState } from 'react'
import Modal from "./Modal"
import useRentModal from '@/app/hooks/useRentModal';
import Heading from '../Heading';
import {categories} from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import { FieldValues, useForm } from 'react-hook-form';

enum STEPS {
    CATEGORY = 0,
    BUILDING = 1,
    INFO = 2,
    IMAGES = 3,
}

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);

    const{
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    }=useForm<FieldValues>({
        defaultValues:{
            number:'',
            floor: 0,
            imageSrc:'',
            category: [],
            location: null,
            capacity: 1,
            whiteboards: 0,
            computers:0,
            projector:0,
            buildingId: ''
        }
    });

    let category=watch('category');
    
    const setCustomValue = (id: string, value: any) =>{
        
        if(id==='category'){
            console.log(value);
        // Correctly use watch to get the current state of category
        const currentCategories = watch('category'); // Ensure this is an array
        
        const isSelected = currentCategories.includes(value);
        console.log('here');
        
        if (isSelected) {
            // If already selected, remove it from the array
            console.log("Removing category: " + value);
            setValue('category', currentCategories.filter((category: String[]) => category !== value), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        } else {
            // If not selected, add it to the array
            console.log("Adding category: " + value);
            setValue('category', [...currentCategories, value], {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        }
            
        }else{
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })}
    }

    const onBack = () =>{
        setStep((value) => value-1);
    };

    const onNext=() => {
        setStep((value)=>value+1);
    };

    const actionLabel= useMemo(()=>{
        if(step === STEPS.IMAGES){
            return 'Create';
        }
        return 'Next';
    },[step])

    const secondaryActionLabel = useMemo(() =>{
        if(step === STEPS.CATEGORY){
            return undefined;
        }
        return 'Back';
    },[step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
            title="Choose the correct categories."
            subtitle="Pick a category"
            />

            <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                        onClick={(category)=> setCustomValue('category', category)}
                        selected={Array.isArray(category) ? category.includes(item.label) : false}
                        label={item.label}
                        icon={item.icon}/>
                    </div>
                ))}
            </div>
        </div>
    )
  return (
    <Modal
        isOpen = {rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={rentModal.onClose}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined: onBack}
        title="Add a Room!"
        allowClose={true}
        body={bodyContent}
    />
  );
}

export default RentModal