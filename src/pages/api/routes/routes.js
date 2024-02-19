import { useRouter } from 'next/router';

const useNavigation = () => {

  const router = useRouter();

  const handleUsersClick = () => {
    router.push('/users');
  };

  const handleCoursesClick = () => {
    router.push('/courses');
  };

  const handleQuizzesClick = () => {
    router.push('/banks');
  };


  return {
    handleUsersClick,
    handleCoursesClick,
    handleQuizzesClick,
  };
};

export default useNavigation;
