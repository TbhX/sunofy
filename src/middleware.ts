import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP: img-src includes suno.ai for covers, media-src includes soundhelix and suno.ai for audio
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://suno.ai https://cdn1.suno.ai https://cdn2.suno.ai https://*.r2.dev; media-src 'self' https://www.soundhelix.com https://suno.ai https://cdn1.suno.ai https://cdn2.suno.ai https://*.r2.dev; connect-src 'self' https://suno.ai https://*.r2.dev;"
  );

  return response;
}

export const config = {
  matcher: '/:path*',
};
