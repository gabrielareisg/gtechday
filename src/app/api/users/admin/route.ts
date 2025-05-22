import { NextResponse } from 'next/server';
import { db } from '@/db';
import { login } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const adminUsers = await db.query.login.findMany({
      where: eq(login.user_type, 0),
      columns: {
        username: true
      }
    });

    return NextResponse.json(adminUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 