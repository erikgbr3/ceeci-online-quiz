import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PeopleIcon from '@mui/icons-material/People';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, TextareaAutosize, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import useModal from '../../../hooks/useModal'; // Ajusta la importación según la nueva ubicación
import apiClient from '../../../apiClient';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddQuestion ({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);

  const [category, setCategoryId] = React.useState('');
  const [categories, setCategories] = useState([]);

  const [firstTime, setFirstTime] = useState(true);


  const addOption = () => {
    // Puedes implementar lógica para validar opciones antes de agregarlas
    if (options.length < 4) {
      setOptions([...options, '']); // Agrega una opción vacía
      setFirstTime(false);
    }
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // const handleChangeCategory = (event) => {
  //   setCategories(event.target.value);
  // };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  useEffect(() => {
    apiClient.get('api/categories')
    .then(response => {
      setCategories(response.data || [])
    })
    .catch(error => {
      console.log(error);
    })
  }, []);


  const [user, setUser] = useState({
    status: '',
    area: '',
    observations: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = () => {
    console.log('Pregunta:', question);
    console.log('Opciones:', options);
    console.log('Categoría:', category);
    closeModal();
  };


  return (
    <div>
      <Box xs={6} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={openModal}
          sx={{ margin: "10px", backgroundColor: "#223354"}}
          variant="contained"
          color="primary"
          startIcon={<PeopleIcon />}
        >
          Agregar Preguntas
        </Button>
      </Box>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold"
        }}
      >
        <span>Agregar Preguntas</span>
      </DialogTitle>
      <DialogContent>
        <div id="alert-dialog-slide-description">
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12}>
              <TextField
                id='question'
                {
                ...register('textQuestion',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      message: 'No es una categoria válida.'
                    }
                  })
                }
                variant="outlined"
                fullWidth
                label="Pregunta"
                value={question}
                onChange={handleQuestionChange}
              />
            </Grid>
          </Grid>
          {options.map((option, index) => (
            <Grid item xs={12} key={index} sx={{ marginTop: index === 0 ? '35px' : '2px' }}>
              <TextField
                variant="outlined"
                fullWidth
                label={`Opción ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <IconButton onClick={() => removeOption(index)}>
                <CancelIcon />
              </IconButton>
            </Grid>
          ))}
          {options.length < 4 && (  // Mostrar el botón solo si no se han alcanzado las 4 opciones
            <Grid item xs={12}>
              <Tooltip title="Agregar Opción">
                <IconButton
                  color="primary"
                  aria-label="Agregar Opción"
                  onClick={addOption}
                  sx={{ mt: 1, mr: 1 }}
                >
                  <AddCircleIcon style={{ fontSize: 30 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Categoría</InputLabel>
              <Select
                id='category'
                {
                ...register('category',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      message: 'No es una categoria válida.'
                    }
                  })
                }
                onChange={e => setCategoryId(e.target.value)}
                value={category}
                label="Selecciona la Categoria"
              >
                <MenuItem value="">Selecciona la Categoria</MenuItem>
                  {categories && categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{`${item.name}`}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </div>
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
          <Button onClick={closeModal} variant="contained" color="error" startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="success" startIcon={<AddCircleIcon />}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}