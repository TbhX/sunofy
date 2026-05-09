import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { likedSongs, songs, playlists } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Get liked songs
    const liked = await db.select({
      song: songs,
      likedAt: likedSongs.likedAt,
    })
      .from(likedSongs)
      .innerJoin(songs, eq(likedSongs.songId, songs.id))
      .where(eq(likedSongs.userId, userId))
      .orderBy(desc(likedSongs.likedAt))
      .all();

    // Get playlists
    const userPlaylists = await db.select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.updatedAt))
      .all();

    return NextResponse.json({
      likedSongs: liked.map(l => ({ ...l.song, likedAt: l.likedAt })),
      playlists: userPlaylists,
    });
  } catch (error: any) {
    console.error('Library error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
