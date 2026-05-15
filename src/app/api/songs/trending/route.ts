import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs, artists, likedSongs } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Subquery to count likes per song
    const likeCounts = db.select({
      songId: likedSongs.songId,
      count: sql<number>`count(*)`.as('like_count'),
    })
    .from(likedSongs)
    .groupBy(likedSongs.songId)
    .as('like_counts');

    // Fetch trending songs: rank by playCount + (likes * 5)
    // We join with the subquery and the artists table
    const trendingSongs = await db.select({
      id: songs.id,
      sunoId: songs.sunoId,
      title: songs.title,
      coverUrl: songs.coverUrl,
      audioUrl: songs.audioUrl,
      durationSeconds: songs.durationSeconds,
      playCount: songs.playCount,
      likeCount: sql<number>`coalesce(${likeCounts.count}, 0)`,
      artist: {
        id: artists.id,
        name: artists.name,
        avatarUrl: artists.avatarUrl,
      }
    })
    .from(songs)
    .leftJoin(likeCounts, eq(songs.id, likeCounts.songId))
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .orderBy(desc(sql`${songs.playCount} + (coalesce(${likeCounts.count}, 0) * 5)`))
    .limit(20)
    .all();

    return NextResponse.json(trendingSongs);
  } catch (error: any) {
    console.error('Trending feed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
