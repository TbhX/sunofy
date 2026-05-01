
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Artists (Suno creators)
CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  suno_id TEXT UNIQUE NOT NULL,  -- Suno's internal ID
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  follower_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Songs
CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  suno_id TEXT UNIQUE NOT NULL,  -- Suno's internal ID
  title TEXT NOT NULL,
  artist_id TEXT REFERENCES artists(id),
  album TEXT,
  genre TEXT,
  mood TEXT,
  duration_seconds INTEGER,
  audio_url TEXT,           -- Cloudflare R2 URL (cached)
  cover_url TEXT,           -- Album art URL
  lyrics TEXT,             -- Full lyrics (cached)
  is_explicit INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Playlists
CREATE TABLE playlists (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Playlist Songs (junction table)
CREATE TABLE playlist_songs (
  playlist_id TEXT REFERENCES playlists(id) ON DELETE CASCADE,
  song_id TEXT REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (playlist_id, song_id)
);

-- Liked Songs
CREATE TABLE liked_songs (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  song_id TEXT REFERENCES songs(id) ON DELETE CASCADE,
  liked_at INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, song_id)
);

-- Listening History
CREATE TABLE listening_history (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  song_id TEXT REFERENCES songs(id) ON DELETE CASCADE,
  played_at INTEGER DEFAULT (unixepoch()),
  duration_played_seconds INTEGER
);

-- Indexes
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX idx_liked_songs_user ON liked_songs(user_id);
CREATE INDEX idx_listening_history_user ON listening_history(user_id);

