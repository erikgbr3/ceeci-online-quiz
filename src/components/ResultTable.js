import * as React from "react";
import { TableRow, TableCell, styled, Grid } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useEffect } from "react";


const RolText = styled("span")(({ isCorrect }) => ({
  backgroundColor: isCorrect ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
  color: isCorrect ? "green" : "red",
  borderRadius: "30px",
  padding: "5px 10px",
  fontWeight: "800",
  display: "inline-block",
}));


function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

function ResultTable({ user, questions }) {
  const [data, setData] = useState({ ...user });
  const [totalScore, setTotalScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    if (user && user.UserAnswer && questions) {
      const userScore = user.UserAnswer.reduce((acc, answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        const isCorrect = question && question.QuestionOption && question.QuestionOption.length > 0 && answer.selection === question.QuestionOption[0].correctA;
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      setTotalScore(userScore);

      const userAverage = (userScore / questions.length) * 10;
      setAverageScore(userAverage);
    }
  }, [user, questions]);

  return (
    <TableRow key={data.id}>
      <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: 13 }}>{data.name} {data.lastName}</TableCell>

      {questions.map((question) => {
        const userAnswer = user && user.UserAnswer && user.UserAnswer.find((answer) => answer.questionId === question.id);
        const isCorrect = userAnswer && question && question.QuestionOption && question.QuestionOption.length > 0 && userAnswer.selection === question.QuestionOption[0].correctA;

        const userAnswerText = userAnswer ? userAnswer.selection : '';
        const correctAnswerText = question.QuestionOption[0].correctA;

        const truncatedUserAnswer = truncateText(userAnswerText, 10);
        const truncatedCorrectAnswer = truncateText(correctAnswerText, 10);

        const cellStyle = {
          color: isCorrect ? 'green' : 'red',
          padding: 0,
          fontSize: 13,
        };

        return (
          <TableCell key={question.id} style={cellStyle}>
            {userAnswer ? (
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <RolText isCorrect={isCorrect}>
                    {truncatedUserAnswer}
                    {isCorrect ? null : ` (${truncatedCorrectAnswer})`}
                  </RolText>
                </Grid>
                <Grid item>
                  {isCorrect ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    <CloseIcon style={{ color: "red" }} />
                  )}
                </Grid>
              </Grid>
            ) : (
              <span style={{ color: "orange", fontWeight: 'bold', fontSize: 13}}>Sin responder</span>
            )}
          </TableCell>
        );
      })}

      <TableCell>{totalScore}/{questions.length}</TableCell>
      <TableCell>{averageScore.toFixed(2)}</TableCell>
    </TableRow>
  );
}

export default ResultTable;