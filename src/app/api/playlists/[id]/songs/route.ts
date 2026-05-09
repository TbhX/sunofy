import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { playlists, playlistSongs } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { songId } = await req.json();

    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
    }

    const playlist = await db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    if (playlist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if song already in playlist
    const existing = await db.select()
      .from(playlistSongs)
      .where(and(eq(playlistSongs.playlistId, id), eq(playlistSongs.songId, songId)))
      .get();

    if (existing) {
      return NextResponse.json({ error: 'Song already in playlist' }, { status: 400 });
    }

    // Get max position
    const result = await db.select({
      maxPos: sql<number>`max(${playlistSongs.position})`
    })
      .from(playlistSongs)
      .where(eq(playlistSongs.playlistId, id))
      .get();
    
    const nextPosition = (result?.maxPos ?? -1) + 1;

    await db.insert(playlistSongs).values({
      playlistId: id,
      songId,
      position: nextPosition,
    });

    return NextResponse.json({ success: true, position: nextPosition });
  } catch (error: any) {
    console.error('Add song to playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
