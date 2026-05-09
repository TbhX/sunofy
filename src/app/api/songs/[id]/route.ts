import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const song = await db.select()
      .from(songs)
      .where(or(eq(songs.id, id), eq(songs.sunoId, id)))
      .get();

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error: any) {
    console.error('Get song error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
