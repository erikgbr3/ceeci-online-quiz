import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';

import useModal from '../../../hooks/useModal';
import apiClient from '../../../apiClient';

import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddQuestion({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const bankId = router.query.bankId || null;

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    correctA: '',
  });

  const { handleSubmit, setError, reset } = useForm();

  const onSubmitQuestion = async () => {
    try {
      // Si todas las opciones están vacías, solo registra la pregunta
      if (
        !options.option1.trim() &&
        !options.option2.trim() &&
        !options.option3.trim() &&
        !options.correctA.trim()
      ) {
        const response = await apiClient.post('/api/questions', {
          textQuestion: question,
          bankId: bankId,
        });

        resetForm();

        closeModal();
        recharge();

        Swal.fire({
          position: 'center',
          icon: 'success',
          text: response.data.message,
          confirmButtonText: 'Aceptar',
        });
        setTimeout(() => {
          Swal.close();
        }, 1500);
      } else {
        // Si al menos una opción tiene valor, registra la pregunta y las opciones
        const response = await apiClient.post('/api/questions', {
          textQuestion: question,
          options: {
            option1: options.option1,
            option2: options.option2,
            option3: options.option3,
            correctA: options.correctA,
          },
          bankId: bankId,
        });

        resetForm();

        closeModal();
        recharge();

        Swal.fire({
          position: 'center',
          icon: 'success',
          text: response.data.message,
          confirmButtonText: 'Aceptar',
        });
        setTimeout(() => {
          Swal.close();
        }, 1500);
      }
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || 'Error al agregar la pregunta');
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((errorItem) => {
          setError(errorItem.field, {
            type: 'validation',
            message: errorItem.error,
          });
        });
      }
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions({
      option1: '',
      option2: '',
      option3: '',
      correctA: '',
    });
  };

  return (
    <div>
      <Box xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={openModal}
          sx={{ margin: '10px', backgroundColor: '#223354' }}
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
        >
          Agregar Pregunta
        </Button>
      </Box>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
        component={'form'}
        onSubmit={handleSubmit(onSubmitQuestion)}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 25,
            fontWeight: 'bold',
          }}
        >
          <span>Agregar Pregunta</span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12}>
              <TextField
                id="textQuestion"
                variant="outlined"
                fullWidth
                label="Pregunta"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="option1"
                variant="outlined"
                fullWidth
                label="Posible respuesta 1"
                value={options.option1}
                onChange={(e) =>
                  setOptions((prevOptions) => ({
                    ...prevOptions,
                    option1: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="option2"
                variant="outlined"
                fullWidth
                label="Posible respuesta 2"
                value={options.option2}
                onChange={(e) =>
                  setOptions((prevOptions) => ({
                    ...prevOptions,
                    option2: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="option3"
                variant="outlined"
                fullWidth
                label="Posible respuesta 3"
                value={options.option3}
                onChange={(e) =>
                  setOptions((prevOptions) => ({
                    ...prevOptions,
                    option3: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="correctA"
                variant="outlined"
                fullWidth
                label="Respuesta correcta"
                value={options.correctA}
                onChange={(e) =>
                  setOptions((prevOptions) => ({
                    ...prevOptions,
                    correctA: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: '80px',
            marginLeft: '80px',
            marginBottom: '5px',
          }}
        >
          <Button
            onClick={closeModal}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<AddCircleIcon />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
