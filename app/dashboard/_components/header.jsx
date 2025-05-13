"use client";
import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path)
  }, [path])
  // Normalize path to remove leading slash and lowercase for comparison
  const normalizedPath = path ? path.toLowerCase().replace(/^\//, '') : '';

  return (
    <div className='w-full flex items-center justify-between px-8 py-4 bg-secondary shadow-md'>
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <Image src={'/logo.svg'} width={300} height={200} alt='Logo' priority />
      </div>
      {/* Navigation */}
      <ul className='hidden md:flex flex-grow justify-center gap-12 items-center'>
        <li className={`text-purple-600 hover:text-purple-100 font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none px-3 py-1 rounded-md text-base ${normalizedPath === 'dashboard' ? 'text-primary font-bold' : ''}`}>
          Dashboard
        </li>
        <li className={`text-purple-600 hover:text-purple-100 font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none px-3 py-1 rounded-md text-base ${normalizedPath === 'questions' ? 'text-primary font-bold' : ''}`}>
          Questions
        </li>
        <li className={`text-purple-600 hover:text-purple-100 font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none px-3 py-1 rounded-md text-base ${normalizedPath === 'upgrade' ? 'text-primary font-bold' : ''}`}>
          Upgrade
        </li>
        <li className={`text-purple-600 hover:text-purple-100 font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none px-3 py-1 rounded-md text-base ${normalizedPath === "how it&apos;s works?" ? 'text-primary font-bold' : ''}`}>
          How it&apos;s Works?
        </li>
        
      </ul>
      {/* User Button */}
      <div className="flex-shrink-0 flex items-center">
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
