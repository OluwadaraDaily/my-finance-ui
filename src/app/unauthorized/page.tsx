'use client';

import { PrimaryButton, SecondaryButton } from '@/components/button';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Logo Header */}
      <div className="h-[70px] bg-grey-900 rounded-bl-lg rounded-br-lg flex items-center justify-center">
        <Image
          src="/icons/logo.svg"
          alt="My Finance Logo"
          width={121}
          height={22}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <Shield className="w-12 h-12 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Access Denied
              </h1>
              <p className="text-muted-foreground">
                You don&apos;t have permission to access this resource. This could be because:
              </p>
            </div>

            <ul className="text-sm text-muted-foreground text-left list-disc pl-4 space-y-2">
              <li>Your session has expired</li>
              <li>You don&apos;t have the required permissions</li>
              <li>You&apos;re trying to access a restricted area</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <PrimaryButton
              label="Sign in again"
              onClick={() => router.push('/login')}
            />
            
            <SecondaryButton 
              label="Go back"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </div>
    </div>
  );
} 