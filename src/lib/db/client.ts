import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const url = process.env.TURSO_DATABASE_URL || "libsql://dummy.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN || "dummy";

if (!process.env.TURSO_DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn('TURSO_DATABASE_URL is not defined, using dummy for build compatibility');
}

if (url.startsWith('libsql://') && !authToken) {
  throw new Error('TURSO_AUTH_TOKEN is not defined for remote database');
}

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
