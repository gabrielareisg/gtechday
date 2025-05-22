import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export async function GET() {
  try {
    const allTasks = await db.query.tasks.findMany();
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newTask = await db.insert(tasks).values({
      user: data.user,
      description: data.description,
      status: data.status,
      priority: data.priority,
    }).returning();

    return NextResponse.json(newTask[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 