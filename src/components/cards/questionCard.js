import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardActions, CardContent, Typography, Button, Box, CardMedia, Grid, Chip, Paper  } from "@mui/material";
// import EditComponentModal from "../modals/editComponentModal";
import WarningIcon from "@mui/icons-material/Warning";
import apiClient from "../../../apiClient";


function QuestionCard({ question, index, options, onDelete, onUpdate }) {
  const [optionsQuestion, setOptions] = React.useState({ ...options });
  // const [edit, setEdit] = React.useState(false);

  // const handleEdit = () => {
  //   setEdit(true);
  // }

  // const cancelEdit = () => {
  //   setEdit(false);
  // }

  // const handleDelete = () => {
  //   onDelete(data.id);
  // }


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
    marginBottom: '16px',
    backgroundColor: '#f5f5f5',
    fontSize: 14,

  };

  const listStyle = {
    listStyleType: 'none',
    marginLeft: '12px',
    marginTop: '8px',
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
              {question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index)}.`}</span> {option.option1}
                </div>
              ))}
              {question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index + question.QuestionOption.length)}.`}</span> {option.option2}
                </div>
              ))}
              {question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listItemStyle}>
                  <span style={incisoStyle}>{`${getAlphabetLetter(index + 2 * question.QuestionOption.length)}.`}</span> {option.option3}
                </div>
              ))}

              {question.QuestionOption.map((option, index) => (
                <div key={option.id} style={listStyle}>La respuesta correcta es: 
                  <span style={incisoStyle}> {option.correctA}</span>
                </div>
              ))}

              
            </ul>
          </CardContent>
        </Card>
       </Box>
     </div>
  )
}

export default QuestionCard;



