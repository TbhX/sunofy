import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Caches an audio file from Suno to Cloudflare R2.
 * @param songId The Suno song ID.
 * @param audioUrl The temporary Suno audio URL.
 * @returns The public R2 URL for the cached audio.
 */
export async function cacheAudio(songId: string, audioUrl: string): Promise<string> {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not defined");
  }

  const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  const key = `songs/${songId}.mp3`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "audio/mpeg",
    })
  );

  const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com`;
  return `${publicUrl}/${key}`;
}
