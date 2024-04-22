"use client";

import React, { useEffect, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  formatPrice?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  value?: string | number;
  onChange?: (id: string, value: string) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    value
  );
  const { ref, onChange: formOnChange, ...rest } = register(id, { required });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(id, newValue);
    }
    if (formOnChange) {
      formOnChange(e);
    }
  };

  return (
    <div className="w-full relative">
      <input
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        // {...register(id, { required })}
        ref={ref}
        {...rest}
        placeholder=" "
        type={type}
        className={`peer 
        w-full 
        p-4 
        pt-6 
        font-light 
        bg-white border-2 
        rounded-md 
        outline-none 
        transition 
        disabled:opacity-70 
        disabled:cursor-not-allowed 
        ${errors[id] ? "border-rose-500" : "border-neutral-300"}
        ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}`}
      />
      <label
        className={`
        absolute
        text-md
        duration-150
        transform
        -translate-y-3
        top-5
        z-9
        origin-[0]
        ${formatPrice ? "left-9" : "left-4"}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-blue-500" : "text-zinc-400"}`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
