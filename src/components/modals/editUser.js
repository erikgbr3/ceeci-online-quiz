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
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import apiClient from "../../../apiClient";

function EditUser({ isOpen, closeModal, onUpdate, user }) {
  // const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { register, handleSubmit, reset, formState: { errors }, setError, } = useForm();

  const [users, setUsers] = React.useState([]);

  const onSubmit = (data,) => {
    data.id = user.id;
    console.log("Usuario a actualizar:", user);
    apiClient.put(`/api/users?id=${user.id}`, data)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data); 
        Swal.fire({
          position: "center",
          icon: "success",
          text: response.data.message,
          confirmButtonText: "Aceptar",
        })
        console.log(data);
        closeModal();
        onUpdate(data);
        //reset();
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

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
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
        Editar Usuario
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} >
              <TextField
                id="name"
                label="Nombre"
                variant="outlined"
                fullWidth
                defaultValue={user.name}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                    message: "El nombre solo debe contener letras",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                id="lastName"
                label="Apellidos"
                variant="outlined"
                fullWidth
                defaultValue={user.lastName}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register("lastName", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                    message: "El apellido solo debe contener letras",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12} >
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  defaultValue={user.email}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: "El Email es Obligatorio",
                    pattern: {
                      value: /(.+)@(.+){2,}\.(.+){3,}/i,
                      message: "No es un email Válido",
                    },
                  })}
                />
              </Grid>
            <Grid item xs={12} >
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="rol">Rol</InputLabel>
                <Select
                  label="Rol"
                  defaultValue={user.rol}
                  id="rol"
                  name="rol"
                  error={!!errors.rol}
                  {...register("rol", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <MenuItem value="administrador">administrador</MenuItem>
                  <MenuItem value="usuario">usuario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContentText>
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
        {/* <Button 
          onClick={closeModal} 
          variant="contained"
          color="error"
        >
          <IconButton color="inherit">
            <CancelIcon />
          </IconButton>
          Cancelar
        </Button>
        <Button 
          variant="contained"
          color="primary"
          type="submit"
        >
          <IconButton color="inherit">
            <SaveIcon />
          </IconButton>
          Guardar
        </Button> */}

        <Button onClick={closeModal} variant="contained" color="error" startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="success" startIcon={<SaveIcon />}>
            Guardar
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUser;
