import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/lojista/login');
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    // Also protect non-admins
    if (user.email !== 'admin@trooka.com.br' && user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
       const url = request.nextUrl.clone();
       url.pathname = '/lojista/dashboard'; // redirect non-admins elsewhere
       return NextResponse.redirect(url);
    }
  }

  // Protect /lojista/dashboard routes
  if (request.nextUrl.pathname.startsWith('/lojista/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/lojista/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect if already logged in and trying to access login pages
  if (user && isAuthRoute) {
     if (user.email === 'admin@trooka.com.br' || user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        if (request.nextUrl.pathname.startsWith('/admin/login')) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/dashboard';
            return NextResponse.redirect(url);
        }
     } else {
        if (request.nextUrl.pathname.startsWith('/lojista/login')) {
            const url = request.nextUrl.clone();
            url.pathname = '/lojista/dashboard';
            return NextResponse.redirect(url);
        }
     }
  }

  return supabaseResponse;
}
