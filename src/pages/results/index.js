import QuestionList from '@/components/QuestionList';
import apiClient from "../../../apiClient";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ResultList from '@/components/ResultList';

const Results = () => {
  const router = useRouter();
  const { bankId } = router.query;
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const { questionId } = router.query;

  const fetchUsersByQuestionId = async (questionId) => {
    try {
      const response = await apiClient.get(`/api/users?questionId=${questionId}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchQuestionsByBankId = async (bankId) => {
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
      fetchQuestionsByBankId(bankId);
      // Agregar la llamada a fetchUsersByQuestionId
      fetchUsersByQuestionId(questionId); 
    }
  }, [bankId, questionId]);

  return (
    <div>
      <ResultList questions={questions} users={users} bankId={bankId} questionId={questionId}/>
    </div>
  );
}

export default Results;