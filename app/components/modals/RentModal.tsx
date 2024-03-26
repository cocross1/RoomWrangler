'use client'

import React, { useMemo, useState } from 'react'
import Modal from "./Modal"
import useRentModal from '@/app/hooks/useRentModal';
import Heading from '../Heading';
import {categories, buildings} from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import BuildingSelect from '../inputs/BuildingSelect';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Input from '../inputs/Input';

enum STEPS {
    CATEGORY = 0,
    BUILDING = 1,
    INFO = 2,
    IMAGES = 3,
}

const RentModal = () => {
    const rentModal = useRentModal();
    const router = useRouter();
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);
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
            buildingName: '',
            number: '',
            floor: 0,
            imageSrc:'',
            category: [],
            capacity: 1,
            whiteboards: 0,
            computers:0,
            projectors:0,
        }
    });

    let building = watch('building');
    let number = watch('number');
    let category=watch('category');
    let floor = watch('floor');
    let capacity = watch('capacity');
    let whiteboards = watch('whiteboards');
    let computers = watch('computers');
    let projectors = watch('projectors'); 
    let imageSrc= watch('imageSrc');
    const setCustomValue = (id: string, value: any) =>{
        
        if(id==='category'){
            console.log(value);
        // Correctly use watch to get the current state of category
        const currentCategories = watch('category'); // Ensure this is an array
        
        const isSelected = currentCategories.includes(value);
        console.log('here');
        
        if (isSelected) {
            // If already selected, remove it from the array
            setValue('category', currentCategories.filter((category: String[]) => category !== value), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        } else {
            // If not selected, add it to the array
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

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      if (step !== STEPS.IMAGES) {

        return onNext();
      }
      
      if(imageSrc === ''){
        toast.error("Please upload an image!")
        return () => {};
      }

      setIsLoading(true);

      const buildingAndNumber = `${data.building} ${data.number}`;
      data.buildingAndNumber = buildingAndNumber;
  
      axios.post('/api/rooms', data)
      .then(() => {
        toast.success('Room created!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY)
        rentModal.onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
    }

    const actionLabel= useMemo(()=>{
        if(step === STEPS.IMAGES){
            return 'Create';
        }
        return 'Next';
    },[step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
          return undefined
        }
    
        return 'Back'
      }, [step]);

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

    if (step === STEPS.BUILDING) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="What building is the room in?"
              subtitle="Choose a building"
            />
             <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto">
                {buildings.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                        onClick={(building)=> setCustomValue('building', building)}
                        selected={building === item.label}
                        label={item.label}
                        icon={item.icon}/>
                    </div>
                ))}
            </div>
          </div>
        );
      }
      if(step === STEPS.INFO){
        bodyContent = (
            <div className="flex flex-col gap-8">
              <Heading
                title="Enter Room Info"
              />
              <Input
                id="number"
                label="Room Number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={true}
              />
              <Counter 
                onChange={(value) => setCustomValue('floor', value)}
                value={floor}
                title="Floor" 
                subtitle="What floor is the room on?"
              />
              <Counter 
                onChange={(value) => setCustomValue('capacity', value)}
                value={capacity}
                title="Capacity" 
                subtitle="What is the capacity of the room?"
              />
              <Counter 
                onChange={(value) => setCustomValue('whiteboards', value)}
                value={whiteboards}
                title="Whiteboards" 
                subtitle="How many whiteboards does the room have?"
              />
            <Counter 
                onChange={(value) => setCustomValue('computers', value)}
                value={computers}
                title="Computers" 
                subtitle="How many computers does the room have?"
              />

            <Counter 
                onChange={(value) => setCustomValue('projectors', value)}
                value={projectors}
                title="Projectors" 
                subtitle="How many projectors does the room have?"
              />
            </div>
          )


      }

      if(step === STEPS.IMAGES){
        bodyContent = (
            <div className="flex flex-col gap-8">
              <Heading
                title="Add a photo of the room."
                subtitle="Show guests what your place looks like!"
              />
              <ImageUpload
                onChange={(value) => setCustomValue('imageSrc', value)}
                value={imageSrc}
              />
            </div>
          )
            
      }
  return (
    <Modal
        isOpen = {rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
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