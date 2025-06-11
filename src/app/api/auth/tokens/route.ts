import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  httpOnly: true,
  sameSite: 'strict' as const,
};

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();
    const cookieStore = await cookies();

    cookieStore.set('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60
    });

    cookieStore.set('refresh_token', refreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set tokens:', error);
    return NextResponse.json(
      { error: 'Failed to set tokens' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return NextResponse.json({ success: true });
} 