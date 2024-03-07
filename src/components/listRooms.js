import * as React from "react";
import { IconButton, Typography, Switch, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect } from 'react';
import apiClient from "../../apiClient";
import useNavigation from "@/pages/api/routes/routes";
import { useState } from "react";
import { useSession } from "next-auth/react";

function ListCategory({ room, onDelete, onUpdate, onClick }) {
  const [data, setData] = React.useState( {room} );
  const [edit, setEdit] = React.useState(false);
  //const [roomss, setRoomss] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [switchState, setSwitchState] = useState(room.enabled);
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();

  const { navigateToBankCreation } = useNavigation();
  
  //const roomUser = roomss.find(item => item.id === data.id)?.roomUser;
  
 
  useEffect(() => {
    console.log("Switch State:", switchState);
  }, [switchState]);

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
    navigateToBankCreation(room.id);
  }
  
  const handleSwitchClick = (event) => {
    event.stopPropagation();
  
    const newSwitchState = !switchState;
    console.log("New Switch State:", newSwitchState);
  
    // Realiza una solicitud PATCH para actualizar el valor en la base de datos
    apiClient
      .patch(`api/rooms?id=${room.id}`, { enabled: newSwitchState })
      .then((response) => {
        // Maneja la respuesta exitosa si es necesario
        console.log("API response", response.data);
        setSwitchState(newSwitchState);
      })
      .catch((error) => {
        // Maneja el error si es necesario
        console.error(error);
      });
  };

  useEffect(() => {
    apiClient.get('api/users')
      .then(response => {
        setUsers(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  const switchContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const switchStyle = {
    marginLeft: 'auto',
    color: '#519581FF',
  };

  const iconButtonStyle = {
    textAlign: 'center'
  }


  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      <Card variant="outlined" style={{
        width: isHovered ? '350px' : '310px',
        height: isHovered ? '170px' : '150px',
        margin: '10px',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        backgroundColor: '#5195810F',
        transition: 'width 0.3s, height 0.3s',
      }}>
          <CardContent style={switchContainerStyle}>
            <div>
              <Typography variant="h7" component="h2" style={{ flex: 1 }}>
                {room.name}
              </Typography>
            </div>
            {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
            <Tooltip title={switchState ? "Deshabilitar" : "Habilitar"}>
            <Switch 
              style={switchStyle} 
              checked={switchState} 
              onChange={() => setSwitchState(!switchState)} 
              onClick={handleSwitchClick}
            />
            </Tooltip>
            )}
          </CardContent>

          <CardContent style={iconButtonStyle}>
            <Tooltip title="Eliminar">
              <IconButton aria-label="Eliminar" onClick={handleDelete} style={{ color: 'red' }}>
                <DeleteIcon style={{ fontSize: '30px' }} />
              </IconButton>
            </Tooltip>
        </CardContent>
      </Card>
    </div>
  );
}

export default ListCategory;