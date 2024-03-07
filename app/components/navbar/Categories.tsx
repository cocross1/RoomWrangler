'use client'

import React from 'react'
import Container from '../Container'
import { FaChalkboard } from "react-icons/fa";
import { BsProjector } from "react-icons/bs";
import { FaComputer } from "react-icons/fa6";
import CategoryBox from '../CategoryBox';
import { FaMicroscope } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { GiRead } from "react-icons/gi";
import { TbWriting } from "react-icons/tb";
import { usePathname, useSearchParams } from 'next/navigation';
export const categories = [
    {
        label: ' Whiteboards ',
        icon: FaChalkboard,
        description: 'Rooms with whiteboards.'
    },
    {
        label: 'Projectors',
        icon: BsProjector,
        description: 'Rooms with projectors.'
    },
    {
        label: 'Computers',
        icon: FaComputer,
        description: 'Rooms with computers'
    },
    {
        label: 'Wall',
        icon: FaMicroscope,
        description: 'Reserve a room in Wall'
    },
    {
        label: 'Chambers',
        icon: TbWriting,
        description: 'Reserve a room in Chambers'
    },
    {
        label: 'Watson',
        icon: FaCode,
        description: 'The Wall Building'
    },
    {
        label: 'Library',
        icon: GiRead,
        description: 'Reserve a room in the library'
    }
]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';
    if(!isMainPage){
        return null;
    }
  return (
    <Container>
        <div className="
        pt-4
        flex
        flex-row
        items-center
        justify-between
        overflow-x-auto">
            {categories.map((item) => (
                <CategoryBox
                    key={item.label}
                    label={item.label}
                    selected={category=== item.label}
                    icon={item.icon}
                    />
            ))}
        </div>
    </Container>
  )
}

export default Categories