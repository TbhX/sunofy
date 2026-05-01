export class CookiePool {
  private cookies: string[] = [];
  private currentIndex: number = 0;

  constructor(initialCookies: string[] = []) {
    this.cookies = initialCookies;
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
