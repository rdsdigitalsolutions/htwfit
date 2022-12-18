import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req, res) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  const cookieLocale = req.cookies.get('NEXT_LOCALE') || {};
  const locale = req.nextUrl.locale || cookieLocale.value || 'en-US';

  if( !req.cookies.get('NEXT_LOCALE') ) {
    const response = NextResponse.next( new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url) );
    response.cookies.set('NEXT_LOCALE', locale);
    return response;
  }

  if (!req.nextUrl.locale) {
    const response = NextResponse.next( new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url) );
    response.cookies.set('NEXT_LOCALE', locale);
    return response;
  }

  if ( req.nextUrl.locale !== req.cookies.get('NEXT_LOCALE')) {
    const response = NextResponse.next( new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url) );
    response.cookies.set('NEXT_LOCALE', locale);
    return response;
  }
}
