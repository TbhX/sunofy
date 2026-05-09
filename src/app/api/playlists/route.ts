import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { playlists } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, isPublic } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const playlistId = crypto.randomUUID();
    const newPlaylist = {
      id: playlistId,
      userId: session.user.id,
      name,
      description: description || null,
      isPublic: isPublic !== undefined ? isPublic : true,
    };

    const [inserted] = await db.insert(playlists).values(newPlaylist).returning();

    return NextResponse.json(inserted);
  } catch (error: any) {
    console.error('Create playlist error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
