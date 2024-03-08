import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import PeopleIcon from "@mui/icons-material/People";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import apiClient from "../../../apiClient";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useModal from '../../../hooks/useModal';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUser({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { register, handleSubmit, reset, formState: { errors }, setError, } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log(data);
    apiClient.post("/api/users", data)
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          text: response.data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#519581FF',
        });
        closeModal();
        recharge();
        reset();
      })
      .catch((error) => {
        console.log(error);
        alert(error.response?.data?.message || 'Error al registrar el usuario');
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((errorItem) => {
            setError(errorItem.field, {
              //error: true,
              type: "validation",
              message: errorItem.error,
            });
          });
        }
      });
  };

  return (
    <div>
      <Box xs={6} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={openModal}
          sx={{ margin: '10px', backgroundColor: '#0B7564' }}
          variant="contained"
          color="primary"
          startIcon={<PeopleIcon />}
        >
          Agregar Usuario
        </Button>
      </Box>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
        // component={"form"}
        // onSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: 25,
            fontWeight: "bold",
            color: "#0B7564"
          }}
        >
          Agregar Usuario
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2} mt={0}>
              <Grid item xs={12} >
                <TextField
                  id="name"
                  variant="outlined"
                  fullWidth
                  label="Nombre"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name", {
                    required: "El nombre es obligatorio",
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
                  variant="outlined"
                  fullWidth
                  label="Apellidos"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  {...register("lastName", {
                    required: "El apellido es obligatorio",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                      message: "El apellido solo debe contener letras",
                    },
                  })}
                />
              </Grid>
              {<Grid item xs={12} md={6}>
                  <FormControl sx={{ m: 0 }} fullWidth>
                      <InputLabel id="demo-simple-select-autowidth-label">Selecciona el rol</InputLabel>
                      <Select
                          id='rol'
                          {
                          ...register('rol',
                              {
                                  required: '*Este campo es obligatorio.',
                                  pattern: {
                                      message: 'No es un rol valido.'
                                  }
                              })
                          }
                          fullWidth
                          label="Selecciona el dispositivo"
                          error={!!errors.rol}
                          helperText={errors.rol?.message}

                      >
                          <MenuItem value="administrador">administrador</MenuItem>
                          <MenuItem value="maestro">maestro</MenuItem>
                          <MenuItem value="usuario">usuario</MenuItem>
                      </Select>
                  </FormControl>
              </Grid>}
              <Grid item xs={12} >
                <TextField
                  id="email"
                  fullWidth
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: "El email es Obligatorio",
                    pattern: {
                      value: /(.+)@(.+){2,}\.(.+){3,}/i,
                      message: "No es un email Válido",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  id="password"
                  fullWidth
                  label="Contraseña"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "La contraseña es obligatorio",
                    minLength: 8,
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
                      message:"La contraseña debe tener mínimo 8 caracteres, una letra mayúscula, una minúscula, al menos un dígito y al menos un carácter especial",
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
            onClick={closeModal} 
            variant="outlined"
            color="error" 
            sx={{ color: "#0B7564"}} 
            startIcon={<CancelIcon />}
            >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="success" 
            sx={{ backgroundColor: "#0B7564"}}
            startIcon={<AddCircleIcon />}
            >
            Agregar
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
