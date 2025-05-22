import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tickets } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateTicketData {
  last_reply: string;
  status: string;
}

interface TicketUpdate {
  last_reply: string;
  status: string;
  date_updated: Date;
  date_finished?: Date;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json() as UpdateTicketData;
    const ticketId = Number.parseInt(params.id);

    // Get current ticket to check status change
    const currentTicket = await db.query.tickets.findFirst({
      where: eq(tickets.id, ticketId)
    });

    if (!currentTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: TicketUpdate = {
      last_reply: data.last_reply,
      status: data.status,
      date_updated: new Date()
    };

    // If status is being changed to closed, set date_finished
    if (data.status === 'closed' && currentTicket.status !== 'closed') {
      updateData.date_finished = new Date();
    }

    console.log('Updating ticket with data:', updateData); // Debug log

    // Update ticket
    const updatedTicket = await db.update(tickets)
      .set(updateData)
      .where(eq(tickets.id, ticketId))
      .returning();

    console.log('Updated ticket:', updatedTicket[0]); // Debug log

    return NextResponse.json(updatedTicket[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 