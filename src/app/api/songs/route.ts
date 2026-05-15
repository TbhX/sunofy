import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs, artists } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artistId = searchParams.get('artistId');

  try {
    let query = db.select({
      song: songs,
      artistName: artists.name,
      artistAvatar: artists.avatarUrl,
    })
    .from(songs)
    .leftJoin(artists, eq(songs.artistId, artists.id));

    if (artistId) {
      // @ts-ignore - drizzle type complexity
      query = query.where(eq(songs.artistId, artistId));
    }

    const results = await query
      .orderBy(desc(songs.createdAt))
      .limit(50)
      .all();

    return NextResponse.json(results.map(r => ({
      ...r.song,
      artist: {
        name: r.artistName || 'Unknown Artist',
        avatarUrl: r.artistAvatar
      }
    })));
  } catch (error: any) {
    console.error('Failed to fetch songs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
