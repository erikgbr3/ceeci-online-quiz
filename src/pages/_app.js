import '@/styles/globals.css';
import { SessionProvider, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Drawer from '@/components/drawer/Drawer';


export default function App({ Component, pageProps }) {
 
  const router = useRouter();
  const excludedRoutes = ['/', '/login', '/restore'];
  let isExcludedRoute = excludedRoutes.includes(router.pathname);
  if (router.pathname.startsWith('/recover-password')) {
    isExcludedRoute = true;
  }

  if (isExcludedRoute) {
    // Si es la página de inicio, no mostrar el MiniDrawer
    return (
      <SessionProvider refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  // Mostrar el MiniDrawer en todas las demás páginas
  const isAdmin = pageProps.session?.rol === 'administrador';


  return (
    <SessionProvider refetchInterval={0}>
      <Drawer>
        <Component {...pageProps} />
      </Drawer>
    </SessionProvider>
  );
}


export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  console.log("Holaaa");
  console.log(session);
  return {
    props: {session},
  };
};
