import { SunoWrapper } from './client.js';

const cookies = (process.env.SUNO_COOKIES || process.env.SUNO_COOKIE || '').split(',').filter(Boolean);

export const sunoWrapper = new SunoWrapper(cookies);
