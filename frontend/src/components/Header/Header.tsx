import React from 'react';
import LogoIcon from '../../assets/icons/LogoIcon';
import '@fontsource/manrope/600.css';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({title}) => {
  return (
    <header className='bg-gray-100 w-full px-4 sm:px-14 md:px-14 py-4 sm:py-5 flex flex-row justify-between items-center border-b border-red-100 fixed top-0 left-0 z-10'>
      <div className='flex flex-row justify-between items-center gap-2.5'>
        <LogoIcon width={36} height={43} color='red' />
        <p className='text-red-600 font-black leading-tight text-sm sm:text-base md:text-lg'>
          Московский <br />транспорт
        </p>
      </div>
      <div>
      <p className="hidden sm:block md:block text-sm sm:text-xl md:text-base leading-[130%] tracking-[0.25px] text-red-500 font-semibold">
        Корпоративный университет Транспортного комплекса
      </p>
      </div>
    </header>
  );
};

export default Header;
