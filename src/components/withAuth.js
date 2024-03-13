import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent, allowedRoles) => {
    const Wrapper = (props) => {
        const { data: session, status } = useSession();
        const router = useRouter();
    
        useEffect(() => {
            if (status === 'loading') return; // Espera a que la sesión esté cargada
      
            if (!session || !allowedRoles.includes(session.user.rol)) {
              router.replace('/login'); // Redirige a la página de inicio de sesión si no está autenticado o no tiene el rol adecuado
            } else {
              switch (session.user.rol) {
                case 'usuario':
                  if (router.pathname !== '/rooms') {
                    router.replace('/rooms'); // Redirige a la página /rooms si el rol es 'usuario' y no está en esa página
                  }
                  break;
                case 'maestro':
                  if (router.pathname !== '/rooms') {
                    router.replace('/rooms'); // Redirige a la página /dashboard si el rol es 'maestro' y no está en esa página
                  }
                  break;
                // Agrega más casos según sea necesario para otros roles
                default:
                  break;
              }
            }
          }, [session, status]);
      
          if (status === 'loading') {
            return <p>Loading...</p>;
          }
      
          return <WrappedComponent {...props} />;
        };
    
      return Wrapper;
}

export default withAuth;