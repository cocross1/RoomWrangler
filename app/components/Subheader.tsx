
'use client'
import React from 'react'

interface SubheaderProps{
    text: string,
    center?: boolean;
}

const Subheader: React.FC<SubheaderProps> = ({text, center}) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
        <div className='text-xl'>
            {text}
        </div>
    </div>
  )
}

export default Subheader;