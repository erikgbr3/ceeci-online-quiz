import * as React from "react";
import { TableRow, TableCell, IconButton, styled, Avatar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { useState, useEffect } from 'react';
import EditUserModal from "./modals/editRoomModal";
import apiClient from "../../apiClient";
import useNavigation from "@/pages/api/routes/routes";

function ListCategory({ room, onDelete, onUpdate, onClick }) {
  const [data, setData] = React.useState({ room });
  const [edit, setEdit] = React.useState(false);
  const [roomss, setRoomss] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const { navigateToBankCreation } = useNavigation();
  
  const roomUser = roomss.find(item => item.id === data.id)?.roomUser;
 


  const handleEdit = (event) => {
    event.stopPropagation();
    setEdit(true);
  }

  const cancelEdit = () => {
    setEdit(false);
  }

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(data.id);
  }

  const handleCardClick = () => {
    console.log("handleCardClick executed");
    navigateToBankCreation(room.id);  // Llama a la función onClick cuando se hace clic en la tarjeta
  }

    useEffect(() => {
      console.log("ListCategory mounted");
        apiClient.get('api/rooms')
        .then(response => {
            setRoomss(response.data || []);
            setData({ ...room });

        })
        .catch(error => {
            console.log(error);
        });

    }, [room]);

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
    <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card variant="outlined" style={{
        width: '250px',
        height: '150px',
        margin: '10px',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer', // Cambiar el cursor cuando se pasa sobre la tarjeta
      }}>
          <CardContent style={{ textAlign: 'center' }}>
              <Typography variant="h7" component="h2"  >
                  {room.name}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <IconButton
                      aria-label="Eliminar"
                      onClick={handleDelete}
                      style={{ color: "red" }}
                      >
                      <DeleteIcon />
                  </IconButton>
                  <IconButton
                      aria-label="Editar"
                      onClick={handleEdit}
                      style={{ color: "blue" }}
                      >
                      <EditIcon />
                  </IconButton>

                  <EditUserModal
                  open={edit}
                  room={data}
                  onClose={cancelEdit}
                  onUpdate={onUpdate}
                  />
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

export default ListCategory;