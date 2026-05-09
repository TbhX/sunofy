import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songs, artists } from '@/lib/db/schema';
import { sunoWrapper } from '@/lib/suno/instance';
import { cacheAudio } from '@/lib/suno/cache';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const sunoSongs = await sunoWrapper.search(query);

    const processedSongs = await Promise.all(sunoSongs.map(async (sunoSong) => {
      // 1. Upsert Artist
      let artistId: string | null = null;
      if (sunoSong.user_id) {
        const artistValues = {
          id: crypto.randomUUID(),
          sunoId: sunoSong.user_id,
          name: sunoSong.user_display_name || sunoSong.user_handle || 'Unknown Artist',
          avatarUrl: sunoSong.user_image_url,
        };

        const [artist] = await db.insert(artists)
          .values(artistValues)
          .onConflictDoUpdate({
            target: artists.sunoId,
            set: {
              name: artistValues.name,
              avatarUrl: artistValues.avatarUrl,
            }
          })
          .returning();
        
        artistId = artist.id;
      }

      // 2. Check if Song exists
      const existingSong = await db.select().from(songs).where(eq(songs.sunoId, sunoSong.id)).get();

      if (existingSong) {
        // Update metadata but keep audioUrl if already cached
        await db.update(songs)
          .set({
            title: sunoSong.title || 'Untitled',
            coverUrl: sunoSong.image_url,
            lyrics: sunoSong.lyric,
            durationSeconds: sunoSong.duration ? Math.floor(sunoSong.duration) : null,
            updatedAt: new Date(),
          })
          .where(eq(songs.sunoId, sunoSong.id));
        
        return { ...existingSong, artistId };
      }

      // 3. Cache Audio
      let audioUrl = sunoSong.audio_url;
      if (audioUrl && (audioUrl.includes('suno.ai') || audioUrl.includes('suno.com'))) {
        try {
          audioUrl = await cacheAudio(sunoSong.id, audioUrl);
        } catch (e) {
          console.error(`Failed to cache audio for ${sunoSong.id}:`, e);
        }
      }

      // 4. Insert Song
      const songValues = {
        id: crypto.randomUUID(),
        sunoId: sunoSong.id,
        title: sunoSong.title || 'Untitled',
        artistId: artistId,
        audioUrl: audioUrl,
        coverUrl: sunoSong.image_url,
        lyrics: sunoSong.lyric,
        durationSeconds: sunoSong.duration ? Math.floor(sunoSong.duration) : null,
      };

      const [newSong] = await db.insert(songs).values(songValues).returning();
      return newSong;
    }));

    return NextResponse.json(processedSongs);
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
