import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { playlists, playlistSongs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, songId: string }> }
) {
  const { id, songId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const playlist = await db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    if (playlist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await db.delete(playlistSongs)
      .where(and(eq(playlistSongs.playlistId, id), eq(playlistSongs.songId, songId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Song not found in playlist' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Remove song from playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
