import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardActions, CardContent, Typography, Box, IconButton, Tooltip, Switch  } from "@mui/material";
// import EditComponentModal from "../modals/editComponentModal";
import apiClient from "../../../apiClient";
import EditQuestion from "../modals/editQuestion";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewAnsweredQuestions from "../modals/ViewAnsweredQuestions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


function QuestionCard({ question, index, options, onDelete, onUpdate, userAnswers }) {
  console.log('Question:', question);
  console.log('Options:', options);
  console.log('User Answers:', userAnswers);
  const [optionsQuestion, setOptions] = React.useState({ ...options });
  const [edit, setEdit] = React.useState(false);
  const [viewUsers, setViewUsers] = React.useState(false);
  const isQuestionAnswered = userAnswers.some(answer => answer.questionId === question.id);
  

  const [switchState, setSwitchState] = useState(question.enabled);
  const { data: session } = useSession();

  useEffect(() => {
    setSwitchState(question.enabled); // Actualiza el estado cuando cambia 'enabled' del banco
  }, [question.enabled]);

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
    apiClient.get('/api/options')
        .then(response => {
            setOptions(response.data || []);
        })
        .catch(error => {
            console.log(error);
        });
  }, [options]);

  const handleSwitchClick = (event) => {
    event.stopPropagation();

    const newSwitchState = !switchState;

    // Actualiza el estado local del switch
    setSwitchState(newSwitchState);

    // Realiza una solicitud PATCH para actualizar el valor en la base de datos
    apiClient
      .patch(`/api/questions?id=${question.id}`, { enabled: newSwitchState })
      .then((response) => {
        // Maneja la respuesta exitosa si es necesario
        console.log("API response", response.data);
        // Puedes omitir esta línea si estás confiado en que la API actualizó correctamente el valor
        // setSwitchState(newSwitchState); 
      })
      .catch((error) => {
        // Maneja el error si es necesario
        console.error(error);
      });
  };

  const cardStyle = {
    // marginBottom: '16px',
    backgroundColor: '#4AAAA216',
    fontSize: 14,
    // margin: '20px'

  };

  const listStyle = {
    listStyleType: 'none',
    marginLeft: '16px',
    marginTop: '8px',
    // padding: '2px'
  };

  const listItemStyle = {
    marginLeft: '16px',
  };

  const incisoStyle = {
    fontWeight: 'bold',
    color: "#0B7564",
  };

  const switchContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const switchStyle = {
    marginLeft: 'auto',
    color: '#519581FF',
  };

  const getAlphabetLetter = (index) => {
    // Obtener la letra del abecedario correspondiente al índice
    return String.fromCharCode(65 + index);
  };

  return (
    <div>
       <Box>
          <Card key={question.id} style={cardStyle}>
          <CardContent style={switchContainerStyle}>
            <div>
              <Typography sx={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
                {index !== undefined ? ` ${index + 1}: ` : ''} {question.textQuestion}
              </Typography>
            </div>
            {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
              <Tooltip title={switchState ? "Deshabilitar" : "Habilitar"}>
                <Switch
                  style={switchStyle}
                  checked={switchState}
                  onChange={handleSwitchClick}
                />
              </Tooltip>
            )}
            </CardContent>
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

          {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
            <>
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
                  style={{ color: "#0B7564" }}
                  >
                    <Tooltip title="Editar" arrow>
                      <EditIcon />
                    </Tooltip>
                </IconButton>
                <IconButton
                  aria-label="Respondida por:"
                  onClick={handleViewUsers}
                  style={{ color: "#0B7564" }}
                  >
                    <Tooltip title="Respondida por:" arrow>
                      <RemoveRedEyeIcon />
                    </Tooltip>
                </IconButton>
              </CardActions>
            </>
          )}
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

