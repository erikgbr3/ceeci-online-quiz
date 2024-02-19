import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

import { useEffect } from 'react';
import apiClient from "../../../apiClient";

function EditUserModal({ open, room, onClose, onUpdate }) {
  

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [data, setData] = React.useState({ ...room });
  const [rooms, setRooms] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userss, setUserId] = React.useState('');
  

  const roomUser = rooms.find(item => item.id === data.id)?.roomUser;


  const onSubmit = (data) => {
   
    data.id = room.id;
    // data.observations = user.observations;
    //posibles modificaciones
    if (!userss || isNaN(userss)) {
      data.userId = 1; // Puedes asignar un valor predeterminado, por ejemplo, 1
    } else {
      data.userId = parseInt(userss, 10); // Convertir a entero si es un número válido
    }
  
    //fin de posibles modificaciones
    console.log("Usuario a actualizar:", room);
    apiClient.put(`/api/rooms?id=${room.id}`, data)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data); 
        Swal.fire({
          position: "center",
          icon: "success",
          text: response.data.message,
          confirmButtonText: "Aceptar",
        })
        console.log(data);
        onClose();
        onUpdate(data);
        //reset();

        // setTimeout(function() {
        //   location.reload(true);
        //   }, 3000); 
        setTimeout(() => {
          Swal.close();
        }, 1500);
        })
      .catch((error) => {
        console.log("Error al actualizar usuario:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          text: error.response?.data?.message || 'Error al actualizar el usuario',
        });
      });
  };

  useEffect(() => {
    apiClient.get('api/rooms')
    .then(response => {
      setUsers(response.data || []);
    })
    .catch(error => {
        console.log(error);
    });

  }, []);

  useEffect(() => {
    apiClient.get('api/users')
      .then(response => {
        setUsers(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      method="post"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Editar Sala
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          defaultValue={data.name}
          {...register("name")}
        />
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
    variant="contained"
    color="error"
    startIcon={<span><CancelIcon /></span>}
  >
    Cancelar
  </Button>
  <Button 
    variant="contained"
    color="primary"
    type="submit"
    startIcon={<span><SaveIcon /></span>}
  >
    Guardar
  </Button>
</DialogActions>

    </Dialog>
  );
}

export default EditUserModal;
