import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tickets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value;

    if (!username) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Query tickets for the logged-in user
    const userTickets = await db.query.tickets.findMany({
      where: eq(tickets.username, username)
    });

    return NextResponse.json(userTickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newTicket = await db.insert(tickets).values({
      username: data.username,
      status: data.status,
      priority: data.priority,
      description: data.description,
      category: data.category,
    }).returning();

    return NextResponse.json(newTicket[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 