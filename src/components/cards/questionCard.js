import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardActions, CardContent, Typography, Button, Box, CardMedia, Grid, Chip, Paper, IconButton, Tooltip  } from "@mui/material";
// import EditComponentModal from "../modals/editComponentModal";
import WarningIcon from "@mui/icons-material/Warning";
import apiClient from "../../../apiClient";
import EditQuestion from "../modals/editQuestion";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewAnsweredQuestions from "../modals/ViewAnsweredQuestions";


function QuestionCard({ question, index, options, onDelete, onUpdate, userAnswers }) {
  console.log('Question:', question);
  console.log('Options:', options);
  console.log('User Answers:', userAnswers);
  const [optionsQuestion, setOptions] = React.useState({ ...options });
  const [edit, setEdit] = React.useState(false);
  const [viewUsers, setViewUsers] = React.useState(false);
  const isQuestionAnswered = userAnswers.some(answer => answer.questionId === question.id);
  

  const handleEdit = () => {
    setEdit(true);
  }

  const cancelEdit = () => {
    setEdit(false);
  }

  const handleViewUsers = () => {
    setViewUsers(true);
  }

  const cancelView = () => {
    setViewUsers(false);
  }

  const handleDelete = () => {
    onDelete(question.id);
  }

  React.useEffect(() => {
    apiClient.get('api/options')
        .then(response => {
            setOptions(response.data || []);
        })
        .catch(error => {
            console.log(error);
        });
  }, [options]);

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
              {/* <Typography variant="body2">{question.bankId}</Typography> */}
              
              {/* Renderizar las opciones */}
              <ul>
              {question.QuestionOption && question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index)}.`}</span> {option.option1}
                </div>
              ))}
              {question.QuestionOption && question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index + question.QuestionOption.length)}.`}</span> {option.option2}
                </div>
              ))}
              {question.QuestionOption && question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index + 2 * question.QuestionOption.length)}.`}</span> {option.option3}
                </div>
              ))}

              {question.QuestionOption && question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listStyle}>La respuesta correcta es: 
                  <span style={incisoStyle}> {option.correctA}</span>
                </div>
              ))}
            </ul>
            {/* Mostrar mensaje si la pregunta ya ha sido respondida */}
            {isQuestionAnswered && (
              <div style={listStyle}>
                <span style={incisoStyle}>Esta pregunta ya ha sido respondida</span>
              </div>
            )}
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "flex-end", marginTop: '-30px'}}>
          
          <IconButton
            aria-label="Eliminar"
            onClick={handleDelete}
            style={{ color: "red" }}
            >
              <Tooltip title="Eliminar" arrow>
                <DeleteIcon />
              </Tooltip> 
          </IconButton>
          <IconButton
            aria-label="Editar"
            onClick={handleEdit}
            style={{ color: "blue" }}
            >
              <Tooltip title="Editar" arrow>
                <EditIcon />
              </Tooltip>
          </IconButton>
          <IconButton
            aria-label="Respondida por:"
            onClick={handleViewUsers}
            style={{ color: "blue" }}
            >
              <Tooltip title="Respondida por:" arrow>
                <RemoveRedEyeIcon />
              </Tooltip>
          </IconButton>
          </CardActions>
          <EditQuestion
            open={edit}
            question={question}
            onClose={cancelEdit}
            onUpdate={onUpdate}
          />
          <ViewAnsweredQuestions
            open={viewUsers}
            question={question}
            userAnswers={userAnswers}
            onClose={cancelView}
          />
        </Card>
       </Box>
     </div>
  )
}

export default QuestionCard;

