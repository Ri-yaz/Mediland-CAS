import Image from 'next/image';
import React from 'react'

const Authlayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
    
    <div className='w-1/2 h-full flex items-center justify-center'>
    {children}
    </div>

    <div className='hidden md:flex w-1/2 h-full relative'>
<Image 
    src="/hospital.jpg"
    alt="Picture of clinic "
      width={1000}
      height={1000}
      className="w-full h-full object-cover"
      />
      <div className='absolute top-0 w-full h-full  bg-opacity-70 z-10 flex flex-col items-center justify-center'>
        <h1 className='text-3xl 2xl:text-5xl font-bold text-white'>Mediland Health and Care</h1>
        <h3 className='text-blue-700 text-base'>You're Welcome</h3>
      </div>
    </div>

    </div> 
  );
};

export default Authlayout;