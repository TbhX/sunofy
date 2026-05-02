import { sunoApi, AudioInfo } from './SunoApi.js';
import { CookiePool } from './cookie-pool.js';
import { cacheAudio } from './cache.js';

export class SunoWrapper {
  private cookiePool: CookiePool;

  constructor(cookies: string[]) {
    this.cookiePool = new CookiePool(cookies);
  }

  /**
   * Retrieves song information including metadata and audio URL.
   * @param songId The ID of the song.
   * @returns A promise that resolves to an AudioInfo object.
   */
  public async getSongInfo(songId: string): Promise<AudioInfo> {
    const cookie = this.cookiePool.getCookie();
    const api = await sunoApi(cookie);
    const songs = await api.get([songId]);
    if (!songs || songs.length === 0) {
      throw new Error(`Song ${songId} not found`);
    }
    const song = songs[0];
    if (!song) {
      throw new Error(`Song ${songId} not found`);
    }
    return song;
  }

  /**
   * Specifically fetches the audio URL for a song.
   * @param songId The ID of the song.
   * @returns A promise that resolves to the audio URL or undefined if not found.
   */
  public async getAudioUrl(songId: string): Promise<string | undefined> {
    const song = await this.getSongInfo(songId);
    return song.audio_url;
  }

  /**
   * Retrieves song information and caches the audio to R2.
   * @param songId The ID of the song.
   * @returns A promise that resolves to an AudioInfo object with the cached URL.
   */
  public async getAndCacheSong(songId: string): Promise<AudioInfo> {
    const song = await this.getSongInfo(songId);
    if (song.audio_url) {
      const cachedUrl = await cacheAudio(songId, song.audio_url);
      song.audio_url = cachedUrl;
    }
    return song;
  }

  /**
   * Fetches multiple songs by their IDs.
   * @param songIds Array of song IDs.
   * @returns A promise that resolves to an array of AudioInfo objects.
   */
  public async getSongs(songIds: string[]): Promise<AudioInfo[]> {
    const cookie = this.cookiePool.getCookie();
    const api = await sunoApi(cookie);
    return await api.get(songIds);
  }

  /**
   * Generates a song based on a prompt.
   * @param prompt The prompt.
   * @param makeInstrumental Whether to make it instrumental.
   * @returns A promise that resolves to an array of AudioInfo objects (usually 2).
   */
  public async generate(prompt: string, makeInstrumental: boolean = false): Promise<AudioInfo[]> {
    const cookie = this.cookiePool.getCookie();
    const api = await sunoApi(cookie);
    return await api.generate(prompt, makeInstrumental);
  }
}
