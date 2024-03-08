import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, TextField } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import useModal from '../../../hooks/useModal';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import apiClient from '../../../apiClient';
import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddBank ({ recharge }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { register, handleSubmit, reset, } = useForm();
  const router = useRouter();
  const roomId = router.query.roomId !== undefined ? router.query.roomId : null;


  const onSubmitBank = async (data) => {
    try {
      if (!roomId) {
        throw new Error('No se proporcionó un valor válido para roomId');
      }
      // // console.log('SQL antes de la inserción:', `INSERT INTO Banks (name, roomId, createdAt, updatedAt) VALUES ('${data.name}', ${room.Id}, NOW(), NOW());`);
      const response = await apiClient.post("/api/banks", {
        name: data.name,
        roomId: roomId,
      });

      reset();

      closeModal();
      recharge();

      Swal.fire({
        position: "center",
        icon: "success",
        text: response.data.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#519581FF',

      });
      setTimeout(() => {
        Swal.close();
      }, 1500);

    } catch (error) {
      // console.error('Error en la solicitud POST a /api/banks:', error);
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
          sx={{ margin: "10px", backgroundColor: "#0B7564"}}
          variant="contained"
          color="primary"
          startIcon={<ArticleIcon />}
        >
          Agregar Banco
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
          fontWeight: "bold",
          color: "#0B7564"

        }}
      >
        <span>Agregar Banco</span>
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
          <Button onClick={closeModal} variant="outlined" color="error" sx={{ color: "#0B7564"}} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="success" sx={{ backgroundColor: "#0B7564"}} startIcon={<AddCircleIcon />}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}