import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import apiClient from "@/apiClient";
import CardUser from "@/components/cards/listUser";
import ModalContentAddUser from "@/components/modals/addUsers";

const UsersView = () => {
  
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteUser = (index) => {
      //Clonar Users
      const usersCopy = [...users];
      usersCopy.splice(index,1);
      //Actualizar el estado users con la nueva lista
      setUsers(usersCopy);

  }
  useEffect(() => {
    apiClient.get("./api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los usuarios:", error);
      });
  }, []);
  console.log(users);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  
  const renderUsers = () => {
     return users.map( (user, index) => (
       <Grid item xs={12} lg={4} xl={12} key={user.id}>
       <CardUser
       index = {index}
       user = {user}
       onDelete = {deleteUser}         
       ruteDirection = {`/users/${user.id}`}
       
      />   
     </Grid>
     ))
 };

  return (
    <Box>
      <div>
        Hola, aqui va la interfaz de usuarios
      </div>


      <Button onClick={handleOpenModal}>Agregar usuario</Button>
      
      <Grid container spacing={2}>
          {renderUsers()}
      </Grid>

      <ModalContentAddUser open={isModalOpen} handleClose={handleCloseModal} />
    
    </Box>
  )
}

export default UsersView;