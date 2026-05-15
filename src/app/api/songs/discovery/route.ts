import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs, artists } from '@/lib/db/schema';
import { eq, desc, and, isNotNull, notLike } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Fetch latest 20 songs that have been cached (not a suno domain URL)
    // We assume any URL that doesn't contain 'suno.com' or 'suno.ai' is a cached R2 URL
    const latestSongs = await db.select({
      id: songs.id,
      sunoId: songs.sunoId,
      title: songs.title,
      coverUrl: songs.coverUrl,
      audioUrl: songs.audioUrl,
      lyrics: songs.lyrics,
      durationSeconds: songs.durationSeconds,
      createdAt: songs.createdAt,
      artist: {
        id: artists.id,
        name: artists.name,
        avatarUrl: artists.avatarUrl,
      }
    })
    .from(songs)
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .where(
      and(
        isNotNull(songs.audioUrl),
        notLike(songs.audioUrl, '%suno.com%'),
        notLike(songs.audioUrl, '%suno.ai%')
      )
    )
    .orderBy(desc(songs.createdAt))
    .limit(20)
    .all();

    return NextResponse.json(latestSongs);
  } catch (error: any) {
    console.error('Discovery feed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
