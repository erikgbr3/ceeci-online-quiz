//AddRooms
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Slide, 
  TextField,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import useModal from '../../../hooks/useModal';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import apiClient from '../../../apiClient';
import { getSession } from 'next-auth/react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddRooms ({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [userId, setUserId] = React.useState('');
  const [users, setUsers] = useState([]);
  const [initialUser, setInitialUser] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    /*Ir por los productos desde el backend */
    apiClient.get('api/users?rol=maestro')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  useEffect(() => {
    async function getUserId() {
      const session = await getSession();

      if (session && session.user && session.user.id) {
        setValue('userId', session.user.id); // Set the ID of the user in the form data
      } else {
        console.error('User session not available');
      }
    }
    getUserId();
  }, [setValue]);

  console.log('Users:', users);
  console.log('UserId:', userId);

  useEffect(() => {
    if (!isOpen) {
      // Restablecer userId cuando se cierra el modal
      setUserId('');
      setName('');
    }
  }, [isOpen]);

  const onSubmitBank = async (data) => {
    try {

      if (!userId) { // Verifica si el ID de usuario está disponible
        console.error('ID de usuario no disponible');
        return;
      }
      const response = await apiClient.post("/api/rooms", {
        name: data.name,
        userId: userId, // Utiliza el ID de usuario obtenido de la sesión iniciada
      });

      reset();
      closeModal();
      recharge();

      Swal.fire({
        position: "center",
        icon: "success",
        text: response.data.message,
        confirmButtonText: "Aceptar",
      });
      setTimeout(() => {
        Swal.close();
      }, 1500);

    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((errorItem) => {
          setError(errorItem.field, {
            type: "validation",
            message: errorItem.error,
          });
        });
      }
    }
  }

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
          Agregar 
        </Button>
      </Box>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
        component={"form"}
        onSubmit={handleSubmit(onSubmitBank)}
      >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold"
        }}
      >
        <span>Agregar Sala</span>
      </DialogTitle>
      <DialogContent>
        <div id="alert-dialog-slide-description">
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} md={6}>
              <TextField
                key={isOpen ? 'modal-open' : 'modal-closed'}
                id='name'
                {
                ...register('name',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      message: 'No es un nombre válido.'
                    }
                  })
                }
                variant="outlined"
                fullWidth
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl sx={{ m: 0 }} fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Selecciona el Maestro</InputLabel>
                <Select
                  id='userId'
                  {...register('userId', {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      message: 'No es un usuario válido.'
                    }
                  })}
                  fullWidth
                  value={userId || ''} // Puedes establecer un valor predeterminado si es necesario
                  label="Selecciona el maestro"
                  onChange={(e) => setUserId(e.target.value)}
                >
                  <MenuItem disabled>Selecciona el Maestro</MenuItem>
                  {users.map((user) => (
                    <MenuItem 
                      key={user.id} 
                      value={user.id}
                    >
                      {`${user.name} ${user.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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