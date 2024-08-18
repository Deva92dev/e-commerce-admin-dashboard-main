'use client';

import { navLinks } from '@/lib/constants';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='md:hidden' onClick={toggleMenu}>
      <MenuIcon className='cursor-pointer' />
      {isOpen && (
        <div className='absolute bg-white shadow-xl text-black right-0 top-20 flex flex-col items-center w-full text-xl z-30'>
          {navLinks.map((link) => (
            <Link
              href={link.url}
              key={link.label}
              className='flex flex-row my-4 cursor-pointer'
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
