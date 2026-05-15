import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { artists } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const artist = await db.select().from(artists).where(eq(artists.id, id)).get();

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (error: any) {
    console.error('Get artist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
