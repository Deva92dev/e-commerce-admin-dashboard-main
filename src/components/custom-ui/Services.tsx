import { servicesLinks } from '@/lib/constants';
import React from 'react';

const Services = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32'>
      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
        {servicesLinks.map((link) => (
          <div key={link.label} className='p-4 bg-slate-50 hover:shadow-lg'>
            <p>{link.icon} </p>
            <h4 className='font-semibold my-4'>{link.label}</h4>
            <p>{link.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
