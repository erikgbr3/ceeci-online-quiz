import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Grid, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditQuestion({ open, question, onClose, onUpdate }) {
  const [questionData, setQuestionData] = useState({
    textQuestion: '',
    QuestionOption: [
      {
        option1: '',
        option2: '',
        option3: '',
        correctA: '',
      },
    ],
  });

  useEffect(() => {
    if (question) {
      setQuestionData({
        textQuestion: question.textQuestion,
        QuestionOption: question.QuestionOption && question.QuestionOption.length > 0
          ? question.QuestionOption
          : [{ option1: '', option2: '', option3: '', correctA: '' }],
      });
    }
  }, [question]);

  const handleInputChange = (field, value) => {
    setQuestionData((prevData) => ({
      ...prevData,
      QuestionOption: [
        {
          ...prevData.QuestionOption[0],
          [field]: value,
        },
      ],
    }));
  };

  const onSubmitQuestion = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.put(`/api/questions?id=${question.id}`, {
        textQuestion: questionData.textQuestion,
        options: {
          option1: questionData.QuestionOption[0].option1 || '',
          option2: questionData.QuestionOption[0].option2 || '',
          option3: questionData.QuestionOption[0].option3 || '',
          correctA: questionData.QuestionOption[0].correctA || '',
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        text: response.data.message,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#519581FF',
      });
      setTimeout(() => {
        Swal.close();
      }, 1500);

      resetForm();
      onClose();
      onUpdate({
        ...response.data.question,
        QuestionOption: questionData.QuestionOption
      });
    } catch (error) {
    console.log("Error al actualizar usuario:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.response?.data?.message || 'Error al actualizar el usuario',
      });
      setTimeout(() => {
        Swal.close();
      }, 1500);
    }
  };

  const resetForm = () => {
    setQuestionData({
      textQuestion: '',
      QuestionOption: [
        {
          option1: '',
          option2: '',
          option3: '',
          correctA: '',
        },
      ],
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      TransitionComponent={Transition}
    >
    <form onSubmit={onSubmitQuestion}>
      <DialogTitle sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold",
          color: "#0B7564"

        }}
      >
        <span>Editar pregunta</span>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={0}>
          <Grid item xs={12}>
            <TextField
              id="textQuestion"
              variant="outlined"
              fullWidth
              label="Pregunta"
              value={questionData.textQuestion}
              onChange={(e) => setQuestionData((prevData) => ({
                ...prevData,
                textQuestion: e.target.value,
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="option1"
              variant="outlined"
              fullWidth
              label="Posible respuesta 1"
              value={questionData.QuestionOption[0].option1}
              onChange={(e) => handleInputChange('option1', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="option2"
              variant="outlined"
              fullWidth
              label="Posible respuesta 2"
              value={questionData.QuestionOption[0].option2}
              onChange={(e) => handleInputChange('option2', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="option3"
              variant="outlined"
              fullWidth
              label="Posible respuesta 3"
              value={questionData.QuestionOption[0].option3}
              onChange={(e) => handleInputChange('option3', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="correctA"
              variant="outlined"
              fullWidth
              label="Respuesta correcta"
              value={questionData.QuestionOption[0].correctA}
              onChange={(e) => handleInputChange('correctA', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
          sx={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "80px",
          marginLeft: "80px",
          marginBottom: "5px",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="error" 
          sx={{ color: "#0B7564"}}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ backgroundColor: "#0B7564"}}
        >
          Guardar
        </Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}
