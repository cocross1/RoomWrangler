'use client';

import { useCallback, useState } from "react";

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
interface DropdownBoxProps {
  id:string;
  register: UseFormRegister<FieldValues>;
  options: string[];
  startVal:string;
  required?:boolean;
  disabled?:boolean;
}

const DropdownBox: React.FC<DropdownBoxProps> = ({
  options,
  startVal,
  register,
  id,
  required,
  disabled
}) => {
    const  [selectedOption, setSelectedOption] = useState(startVal);
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
      };

  return ( 
    <select 
    disabled={disabled}
    value={startVal}
    id={id}
    {... register(id, { required })}
    className="bg-gray-50 border 
    border-gray-300 
    text-gray-900 
    text-sm rounded-lg 
    focus:ring-blue-500 
    focus:border-blue-500
     block 
     p-2.5
     ">
        {options.map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
   );
}
 
export default DropdownBox;