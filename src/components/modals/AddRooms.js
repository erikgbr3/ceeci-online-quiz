import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import useModal from '../../../hooks/useModal';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import apiClient from '../../../apiClient';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddRooms ({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { register, handleSubmit, reset, } = useForm();

  const onSubmitBank = async (data) => {
    try {
      const response = await apiClient.post("/api/rooms", {
        name: data.name,
        userId: data.userId,
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
            <Grid item xs={12}>
              <TextField
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='userId'
                {
                ...register('userId',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      message: 'No es un roomId válido.'
                    }
                  })
                }
                variant="outlined"
                fullWidth
                label="UserId"
              />
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