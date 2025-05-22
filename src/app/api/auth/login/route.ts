import { NextResponse } from 'next/server';
import { db } from '@/db';
import { login } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Query the database for the user
    const user = await db.query.login.findFirst({
      where: eq(login.username, username),
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set the username cookie
    cookies().set('username', username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    // Return user data without password
    return NextResponse.json({
      username: user.username,
      type: user.user_type,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 