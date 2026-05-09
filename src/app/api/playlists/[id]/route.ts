import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { playlists, playlistSongs, songs } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  try {
    const playlist = await db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    // Check if user has access (either public or owner)
    if (!playlist.isPublic && playlist.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch songs in the playlist
    const songsInPlaylist = await db.select({
      song: songs,
      position: playlistSongs.position,
      addedAt: playlistSongs.addedAt,
    })
      .from(playlistSongs)
      .innerJoin(songs, eq(playlistSongs.songId, songs.id))
      .where(eq(playlistSongs.playlistId, id))
      .orderBy(asc(playlistSongs.position))
      .all();

    return NextResponse.json({
      ...playlist,
      songs: songsInPlaylist.map(s => ({ ...s.song, position: s.position, addedAt: s.addedAt })),
    });
  } catch (error: any) {
    console.error('Get playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, isPublic, coverUrl } = await req.json();

    const playlist = await db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    if (playlist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await db.update(playlists)
      .set({
        name: name !== undefined ? name : playlist.name,
        description: description !== undefined ? description : playlist.description,
        isPublic: isPublic !== undefined ? isPublic : playlist.isPublic,
        coverUrl: coverUrl !== undefined ? coverUrl : playlist.coverUrl,
        updatedAt: new Date(),
      })
      .where(eq(playlists.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('Update playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    await db.delete(playlists).where(eq(playlists.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
