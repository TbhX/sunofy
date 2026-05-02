import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";

// --- Auth.js Tables ---

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- Application Tables ---

export const artists = sqliteTable("artist", {
  id: text("id").notNull().primaryKey(),
  sunoId: text("suno_id").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  followerCount: integer("follower_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const songs = sqliteTable("song", {
  id: text("id").notNull().primaryKey(),
  sunoId: text("suno_id").notNull().unique(),
  title: text("title").notNull(),
  artistId: text("artist_id").references(() => artists.id),
  album: text("album"),
  genre: text("genre"),
  mood: text("mood"),
  durationSeconds: integer("duration_seconds"),
  audioUrl: text("audio_url"),
  coverUrl: text("cover_url"),
  lyrics: text("lyrics"),
  isExplicit: integer("is_explicit", { mode: "boolean" }).default(false),
  playCount: integer("play_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const playlists = sqliteTable("playlist", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  isPublic: integer("is_public", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const playlistSongs = sqliteTable("playlist_song", {
  playlistId: text("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  songId: text("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  addedAt: integer("added_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
}, (table) => ({
  pk: primaryKey({ columns: [table.playlistId, table.songId] }),
}));

export const likedSongs = sqliteTable("liked_song", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  songId: text("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  likedAt: integer("liked_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.songId] }),
}));

export const listeningHistory = sqliteTable("listening_history", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  songId: text("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  playedAt: integer("played_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  durationPlayedSeconds: integer("duration_played_seconds"),
});
