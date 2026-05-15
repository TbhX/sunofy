import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs, artists } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await db.select({
      song: songs,
      artist: artists,
    })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .where(or(eq(songs.id, id), eq(songs.sunoId, id)))
      .get();

    if (!result) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...result.song,
      artist: result.artist ? {
        id: result.artist.id,
        name: result.artist.name,
        avatarUrl: result.artist.avatarUrl,
      } : null
    });
  } catch (error: any) {
    console.error('Get song error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
