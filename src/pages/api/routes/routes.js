import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const useNavigation = () => {

  const router = useRouter();
  const { data: session } = useSession();

  const handleUsersClick = () => {
    if (session?.user?.rol === 'administrador') {
      router.push('/users');
    } else {
      // Acceso denegado para roles diferentes a 'administrador'
      console.log('Acceso denegado a /users para el rol:', session?.user?.rol);
      // Puedes redirigir a una página de acceso denegado o realizar otras acciones según tus necesidades.
    }
  };

  const handleCoursesClick = () => {
    router.push('/rooms');
  };

  const handleQuizzesClick = () => {
    router.push('/banks');
  };

  const navigateToBankCreation = (roomId) => {
    console.log('Navigating to bank creation with:', roomId);
    const destination = `/banks/create${roomId ? `?roomId=${roomId}` : ''}`;
    router.push(destination);
  };

  return {
    handleUsersClick,
    handleCoursesClick,
    handleQuizzesClick,
    handleQuestionsClick,
    
    navigateToBankCreation,
    navigateToQuestionsCreation,
  };
};

export default useNavigation;
