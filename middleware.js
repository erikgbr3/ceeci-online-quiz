import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export  async function middleware(request) {
    // Verificar que el usuario esté autenticado  
    const session = await getSession({ req: request });
    console.log(session);
    // Estraer la ruta que se estaba visualizando 
    if (!session ) {
      return NextResponse.redirect(`http://localhost:3000/login`)
    }

    // Si está autenticado, continuar con la petición
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // '/home/:path*',
    '/home/:path*',
    '/users',
    '/rooms',
  ]
} 
