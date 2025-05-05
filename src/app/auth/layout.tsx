import React from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className='h-[70px] lg:hidden bg-grey-900'>

      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
