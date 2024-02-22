import { useRouter } from 'next/router';

const useNavigation = () => {

  const router = useRouter();

  const handleUsersClick = () => {
    router.push('/users');
  };

  const handleCoursesClick = () => {
    router.push('/rooms');
  };

  const handleQuizzesClick = () => {
    router.push('/banks');
  };

  const handleQuestionsClick = () => {
    router.push('/questions');
  };

  // const navigateToBankCreation = (roomId) => {
  //   const currentPath = router.asPath;

  //   // Si ya estás en la misma ruta, forzar la recarga de la página
  //   if (currentPath.includes('/banks/create')) {
  //     router.push(`/banks/create?roomId=${roomId}`, undefined, { shallow: true });
  //   } else {
  //     router.push(`/banks/create?roomId=${roomId}`);
  //   }
  // };

  const navigateToBankCreation = (roomId) => {
    console.log('Navigating to bank creation with :', );
    router.push(`/banks/create?roomId=${roomId}`);
  };

  const navigateToQuestionsCreation = (bankId) => {
    console.log('Navigating to bank creation with :', );
    router.push(`/questions/create?bankId=${bankId}`);
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
