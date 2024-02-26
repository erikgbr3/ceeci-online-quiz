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
