// import QuestionList from '@/components/QuestionList';
// import apiClient from "../../../apiClient";
// import { useEffect, useState } from "react";
// import { useRouter } from 'next/router';
// import ResultList from '@/components/ResultList';

// const Results = () => {
//   const router = useRouter();
//   const { bankId } = router.query;
//   const [questions, setQuestions] = useState([]);
  

//   const fetchResults = async (bankId) => {
//     try {
//       const response = await apiClient.get(`/api/questions?bankId=${bankId}`);
//       setQuestions(response.data);
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   useEffect(() => {
//     console.log('bankId in useEffect:', bankId);
//     if (bankId) {
//       fetchResults(bankId);
//     }
//   }, [bankId]);

//   return (
//     <div>
//       <ResultList questions={questions}  bankId={bankId}/>
//     </div>
//   );
// }

// export default Results;