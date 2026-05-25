import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Портыг шалгах
  const is3001 = host.includes(':3001') || url.port === '3001';

  // 1. Статик файлууд, API болон Next-ийн дотоод замуудыг шууд нэвтрүүлнэ
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (is3001) {
    // --- 3001 ПОРТ (АДМИН) ---
    
    // Үндсэн хаягийг /admin руу шилжүүлэх
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    // Зөвшөөрөгдөх замууд
    const isAllowed = pathname.startsWith('/admin') || pathname === '/restaurant';

    if (!isAllowed) {
      // Хэрэв буруу зам байвал Redirect хийлгүй шууд 404 буцаана (Loop-ээс сэргийлнэ)
      return new NextResponse(null, { status: 404 });
    }
  } else {
    // --- 3000 ПОРТ (ХЭРЭГЛЭГЧ) ---
    if (pathname.startsWith('/admin')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API болон favicon-оос бусад бүх зүйлд ажиллана
    '/((?!api|favicon.ico).*)',
  ],
};
