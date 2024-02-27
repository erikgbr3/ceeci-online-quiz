import QuestionList from '@/components/QuestionList';
import apiClient from "../../../apiClient";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const Questions = () => {
  const router = useRouter();
  const { bankId } = router.query;
  const [questions, setQuestions] = useState([]);
  

  const fetchQuestions = async () => {
    try {
      const response = await apiClient.get(`/api/questions?bankId=${bankId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    console.log('bankId in useEffect:', bankId);
    if (bankId) {
      fetchQuestions(bankId);
    }
  }, [bankId]);

  return (
    <div>
      <QuestionList questions={questions}  bankId={bankId}/>
    </div>
  );
}

export default Questions;