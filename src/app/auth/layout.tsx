import Image from 'next/image';
import React from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col lg:flex-row h-screen bg-beige-100'>
      <div className='lg:flex-[40%]'>
        {/* Tablet and Mobile Screens */}
        <div
          className='h-[70px] lg:hidden bg-grey-900 rounded-bl-lg rounded-br-lg flex items-center justify-center'
        >
          <Image
            src="/icons/logo.svg"
            alt="My Finance Logo"
            width={121}
            height={22}
          />
        </div>

        {/* Larger Screens */}
        <div className='hidden lg:flex p-5 h-full'>
          <div
            className='bg-grey-900 rounded-xl relative w-full h-full bg-[url(/images/auth_illustration.svg)] bg-[0%_60%] bg-no-repeat bg-cover'
          >
            <div className='absolute top-12 left-12'>
              <Image
                src="/icons/logo.svg"
                alt="My Finance Logo"
                width={121}
                height={22}
              />
            </div>
            <div className='absolute bottom-12 w-[90%] left-1/2 -translate-x-1/2 text-white'>
              <h2 className='header-text mb-4'>Keep track of your money and save for your future</h2>
              <p className="text-sm">
                Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:flex-[60%] flex flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  );
}
