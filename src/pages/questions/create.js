import QuestionList from '@/components/QuestionList';
import apiClient from "../../../apiClient";
import { useEffect, useState } from "react";

const Questions = () => {

  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await apiClient.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <QuestionList questions={questions}  />
    </div>
  );
}

export default Questions;