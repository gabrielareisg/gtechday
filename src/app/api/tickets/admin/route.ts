import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tickets } from '@/db/schema';

export async function GET() {
  try {
    // Query all tickets without user restriction
    const allTickets = await db.query.tickets.findMany();

    return NextResponse.json(allTickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 