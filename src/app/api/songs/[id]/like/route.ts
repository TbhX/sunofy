import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { likedSongs, songs } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    // Find the internal song ID
    const song = await db.select()
      .from(songs)
      .where(or(eq(songs.id, id), eq(songs.sunoId, id)))
      .get();

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const songId = song.id;

    // Check if already liked
    const existing = await db.select()
      .from(likedSongs)
      .where(and(eq(likedSongs.userId, userId), eq(likedSongs.songId, songId)))
      .get();

    if (existing) {
      // Unlike
      await db.delete(likedSongs)
        .where(and(eq(likedSongs.userId, userId), eq(likedSongs.songId, songId)));
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await db.insert(likedSongs).values({
        userId,
        songId,
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
