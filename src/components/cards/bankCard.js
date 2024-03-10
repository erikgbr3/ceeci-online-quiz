
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Switch, Typography, Tooltip, CardActions, Button } from '@mui/material';
import useNavigation from '@/pages/api/routes/routes';
import apiClient from '../../../apiClient';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const BankCard = ({ bank }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { navigateToQuestionsCreation } = useNavigation();
  const { navigateToQuestionsResults } = useNavigation();

  const [switchState, setSwitchState] = useState(bank.enabled);
  const { data: session } = useSession();


  useEffect(() => {
    setSwitchState(bank.enabled); // Actualiza el estado cuando cambia 'enabled' del banco
  }, [bank.enabled]);

  const handleCardClick = () => {
    console.log("handleCardClick executed");
    navigateToQuestionsCreation(bank.id);  // Llama a la función onClick cuando se hace clic en la tarjeta
  }

  const handleButtomClick = () => {
    console.log("handleButtomClick executed");
    navigateToQuestionsResults(bank.id);  // Llama a la función onClick cuando se hace clic en la tarjeta
  }

  const handleSwitchClick = (event) => {
    event.stopPropagation();

    const newSwitchState = !switchState;

    // Actualiza el estado local del switch
    setSwitchState(newSwitchState);

    // Realiza una solicitud PATCH para actualizar el valor en la base de datos
    apiClient
      .patch(`/api/banks?id=${bank.id}`, { enabled: newSwitchState })
      .then((response) => {
        // Maneja la respuesta exitosa si es necesario
        console.log("API response", response.data);
        // Puedes omitir esta línea si estás confiado en que la API actualizó correctamente el valor
        // setSwitchState(newSwitchState); 
      })
      .catch((error) => {
        // Maneja el error si es necesario
        console.error(error);
      });
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };

    const dateTime = new Date(dateTimeString);
    return new Intl.DateTimeFormat('es-ES', options).format(dateTime);
  };

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

  return (
    
      <Card key={bank.id} style={{ backgroundColor: '#4AC7A214'}}>
        <CardContent style={switchContainerStyle}>
          <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <Typography 
              variant="h6"
              style={{ color: isHovered ? 'gray' : 'black' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {bank.name}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: 16, 
                color: 'gray' 
              }}
            >
              {formatDateTime(bank.createdAt)}
            </Typography>
          </div>
          {(session?.user?.rol === 'admin' || session?.user?.rol === 'maestro') && (
          <Tooltip title={switchState ? "Deshabilitar" : "Habilitar"}>
            <Switch
              style={switchStyle}
              checked={switchState}
              onChange={handleSwitchClick}
            />
          </Tooltip>
          )}
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center", marginTop: '10px'}}>
          {/* <Link href="/results"> */}
            <Button 
              onClick={handleButtomClick}
              variant="outlined"
              sx={{ color: "#0B7564"}}
            >
              Ver calificaciones
            </Button>
          {/* </Link> */}
        </CardActions>
              
      </Card>
    
  );
};

export default BankCard;
