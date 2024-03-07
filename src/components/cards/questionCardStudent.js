import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardActions, CardContent, Typography, Button, Box, CardMedia, Grid, Chip, Paper, IconButton, RadioGroup, FormControlLabel, Radio  } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import apiClient from "../../../apiClient";
import EditQuestion from "../modals/editQuestion";
import { useState } from "react";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { getSession } from 'next-auth/react';


function QuestionCardStudent({ question, index, options }) {
  const [optionsQuestion, setOptions] = React.useState({ ...options });

  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [userId, setUserId] = useState(null);


  useEffect(() => {
    async function getUserId() {
      // Obtiene la sesión actual
      const session = await getSession();

      // Verifica si la sesión y el usuario están presentes, y si el ID de usuario está definido
      if (session && session.user && session.user.id) {
        // Establece el ID de usuario en el estado
        setUserId(session.user.id);
      // Carga inicial de preguntas respondidas por el usuario actual desde la base de datos
      try {
        const response = await apiClient.get(`/api/answer?userId=${session.user.id}`);
        const answeredQuestionIds = response.data.map(answer => answer.questionId);
        setAnsweredQuestions(answeredQuestionIds);
      } catch (error) {
        console.error('Error al obtener preguntas respondidas desde la base de datos:', error);
      }
    } else {
      console.error('Sesión de usuario no disponible');
    }
  }

  getUserId();
}, []);
  
  // useEffect(() => {
  //   // Obtener las respuestas de la base de datos al cargar la página
  //   const fetch = async () => {
  //     try {
  //       const response = await apiClient.get(`/api/answer?questionId=${question.id}`);
  //       const answeredQuestionIds = response.data.map(answer => answer.questionId);
  //       setAnsweredQuestions(answeredQuestionIds);
  //     } catch (error) {
  //       console.error('Error al obtener respuestas de la base de datos:', error);
  //     }
  //   };

  //   fetch();

  //   // Obtener las opciones de la API
  //   apiClient.get('api/options')
  //     .then(response => {
  //       setOptions(response.data || []);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });

  //     setAnsweredQuestions([]);
  // }, [question.id, userId]);

  // useEffect(() => {
  //   // Obtener las preguntas contestadas del almacenamiento local al cargar la página
  //   const storedAnsweredQuestions = localStorage.getItem('answeredQuestions');
  //   const answeredQuestionIds = storedAnsweredQuestions ? JSON.parse(storedAnsweredQuestions) : [];
  //   setAnsweredQuestions(answeredQuestionIds);
  // }, []);



  // const handleAnswerChange = (event) => {
  //   // setSelectedAnswer(event.target.value);
  //   setSelectedAnswer({ ...selectedAnswer, [event.target.name]: event.target.value.id });
  // }

  // const handleAnswerChange = (event) => {
  //   setSelectedAnswer({
  //     ...selectedAnswer,
  //     [event.target.name]: {
  //       id: event.target.value.id,
  //       value: event.target.value, // Ajusta esto según la estructura de tu opción
  //     },
  //   });
  // }

  const handleAnswerChange = (event) => {
    const selectedAnswer = question.QuestionOption.find(option => 
      option.option1 === event.target.value
      || option.option2 === event.target.value
      || option.option3 === event.target.value);
  
    if (selectedAnswer) {
      setSelectedAnswer({
        ...selectedAnswer,
        [question.id]: {
          id: selectedAnswer.id,
          value: event.target.value,
        },
      });
    }
  }

  const isQuestionAnswered = answeredQuestions.includes(question.id);


  const handleSubmit = async (questionId) => {
    const selectedAnswers = selectedAnswer[questionId];
    console.log(`Pregunta ${questionId}: Respuesta seleccionada: ${selectedAnswers}`);
  
    if (selectedAnswers) {
      // Obtener la letra correspondiente al índice seleccionado
      // const alphabetLetter = String.fromCharCode(65 + parseInt(selectedOptionValue.split('_')[1]));

      const answerData = {
        selection: selectedAnswers.value,
        userId: userId,
        questionId: questionId,
        optionId: selectedAnswers.id,
      };
      console.log('Datos de respuesta antes de enviar:', answerData); // Agrega este console.log
  
      try {
        const response = await apiClient.post('/api/answer', answerData);
        console.log(`Respuesta enviada para la pregunta ${questionId}:`, response.data);
        
        // Actualizar el estado para marcar la pregunta como contestada
        setAnsweredQuestions((prevAnsweredQuestions) => [...prevAnsweredQuestions, questionId]);

        // Actualizar localStorage con las preguntas contestadas
        // localStorage.setItem('answeredQuestions', JSON.stringify([...answeredQuestions, question.id]));

        Swal.fire({
          position: 'center',
          icon: 'success',
          text: response.data.message,
          confirmButtonText: 'Aceptar',
        });
  
        setTimeout(() => {
          Swal.close();
        }, 1500);
      } catch (error) {
        console.error('Error al enviar la respuesta:', error);
      }
    } else {
      console.warn('El usuario no ha seleccionado una respuesta para la pregunta', questionId);
  
      // Mostrar alerta de error con SweetAlert
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona una respuesta antes de enviar.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

 
  const cardStyle = {
    // marginBottom: '16px',
    backgroundColor: '#f5f5f5',
    fontSize: 14,

  };

  const listStyle = {
    listStyleType: 'none',
    marginLeft: '12px',
    marginTop: '8px',
    // padding: '2px'
  };

  const listItemStyle = {
    marginLeft: '12px',
  };

  const incisoStyle = {
    fontWeight: 'bold',
    color: 'blue',
  };

 

  const getAlphabetLetter = (index) => {
    // Obtener la letra del abecedario correspondiente al índice
    return String.fromCharCode(65 + index);
  };

  return (
    <div>
       <Box>
          <Card key={question.id} style={cardStyle}>
            <CardContent>
              <Typography sx={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
                {index !== undefined ? ` ${index + 1}: ` : ''} {question.textQuestion}
              </Typography>
              
              {/* Renderizar las opciones */}
              <RadioGroup value={selectedAnswer[question.id]?.value || ''} onChange={handleAnswerChange}>
                {question.QuestionOption && question.QuestionOption.map((option, index) => (
                  <FormControlLabel
                    key={option.id}
                    // value={`${option.id}_${index}`}
                    value={option.option1}
                    control={<Radio size="small"/>}
                    name={String(question.id)}
                    label={
                      <div style={listItemStyle}>
                        <span style={incisoStyle}>{`${getAlphabetLetter(index)}.`}</span>{' '}
                        {option.option1}
                      </div>
                    }
                    disabled={isQuestionAnswered}
                  />
                ))}
                {question.QuestionOption && question.QuestionOption.map((option, index) => (
                  <FormControlLabel
                    key={option.id}
                    // value={`${option.id}_${index + 1}`}
                    value={option.option2}
                    control={<Radio size="small"/>}
                    name={question.id} 
                    label={
                      <div style={listItemStyle}>
                        <span style={incisoStyle}>{`${getAlphabetLetter(index + question.QuestionOption.length)}.`}</span>{' '}
                        {option.option2}
                      </div>
                    }
                    disabled={isQuestionAnswered}
                  />
                ))}
                {question.QuestionOption && question.QuestionOption.map((option, index) => (
                   <FormControlLabel
                    key={option.id}
                    // value={`${option.id}_${index + 2}`}
                    value={option.option3}
                    control={<Radio size="small"/>}
                    name={question.id} 
                    label={
                      <div style={listItemStyle}>
                        <span style={incisoStyle}>{`${getAlphabetLetter(index + 2 * question.QuestionOption.length)}.`}</span>{' '}
                        {option.option3}
                      </div>
                    }
                    disabled={isQuestionAnswered}
                  />
                ))}
              </RadioGroup>

          </CardContent>
           <CardActions sx={{ display: "flex", justifyContent: "flex-end", marginTop: '-30px'}}>
            {answeredQuestions.includes(question.id) ? (
              <Typography variant="body2" color="textSecondary" style={{ marginRight: '16px', fontWeight: "bold" }}>
                Pregunta contestada.
              </Typography>
            ) : (
              <Button 
                variant="contained"
                onClick={() => handleSubmit(question.id)}
                disabled={answeredQuestions.includes(question.id)}
              >
                Enviar respuesta
              </Button>
            )}
          </CardActions>
        </Card>
       </Box>
     </div>
  )
}

export default QuestionCardStudent;

