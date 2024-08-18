"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const NavIcons = () => {
    const {user} = useUser();

  return (
    <div>
        {
            user ? (
            <div className='flex items-center justify-center gap-4'>
            <Link href='/wishlist'>Wishlist</Link>
            <Link href='/orders'>Orders</Link>
            <UserButton  />
            </div>

        ) : (<Link href='/sign-in'> <CircleUserRound /> </Link>)
        }
    </div>
  )
}

export default NavIcons