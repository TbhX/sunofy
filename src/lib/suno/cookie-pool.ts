export class CookiePool {
  private cookies: string[] = [];
  private currentIndex: number = 0;

  constructor(initialCookies: string[] = []) {
    if (initialCookies.length > 0) {
      this.cookies = initialCookies;
    } else if (process.env.SUNO_COOKIES) {
      this.cookies = process.env.SUNO_COOKIES.split(',').map(c => c.trim()).filter(c => c.length > 0);
    } else if (process.env.SUNO_COOKIE) {
      this.cookies = [process.env.SUNO_COOKIE];
    }
  }

  public addCookie(cookie: string) {
    if (!this.cookies.includes(cookie)) {
      this.cookies.push(cookie);
    }
  }

  public removeCookie(cookie: string) {
    this.cookies = this.cookies.filter(c => c !== cookie);
  }

  public getCookie(): string {
    if (this.cookies.length === 0) {
      throw new Error('No cookies available in the pool');
    }
    const cookie = this.cookies[this.currentIndex];
    if (cookie === undefined) {
      throw new Error('No cookies available in the pool');
    }
    this.currentIndex = (this.currentIndex + 1) % this.cookies.length;
    return cookie;
  }

  public get size(): number {
    return this.cookies.length;
  }
}
