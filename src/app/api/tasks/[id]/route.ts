import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateTaskData {
  status: string;
  date_updated?: Date;
  date_delivered?: Date;
  date_deadline?: Date;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = Number.parseInt(params.id);
    const currentTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId)
    });

    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const updateData: UpdateTaskData = {
      status: data.status,
      date_updated: new Date()
    };

    // Se o status mudou para 'completed', atualiza date_deadline
    if (data.status === 'completed' && currentTask.status !== 'completed') {
      updateData.date_deadline = new Date();
    }

    // Se o status mudou para 'pending', atualiza apenas o status
    if (data.status === 'pending') {
      updateData.status = 'pending';
    }

    const updatedTask = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 