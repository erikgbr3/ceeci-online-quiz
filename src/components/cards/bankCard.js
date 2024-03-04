
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Switch, Typography, Tooltip } from '@mui/material';
import useNavigation from '@/pages/api/routes/routes';
import apiClient from '../../../apiClient';
import { useSession } from 'next-auth/react';

const BankCard = ({ bank }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { navigateToQuestionsCreation } = useNavigation();

  const [switchState, setSwitchState] = useState(bank.enabled);
  const { data: session } = useSession();


  useEffect(() => {
    setSwitchState(bank.enabled); // Actualiza el estado cuando cambia 'enabled' del banco
  }, [bank.enabled]);

  const handleCardClick = () => {
    console.log("handleCardClick executed");
    navigateToQuestionsCreation(bank.id);  // Llama a la función onClick cuando se hace clic en la tarjeta
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

  const switchContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const switchStyle = {
    marginLeft: 'auto',
  };

  return (
    
      <Card key={bank.id} style={{ marginBottom: '16px', backgroundColor: '#f5f5f5', marginLeft: '90px', marginRight: '90px' }}>
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
          </div>
          {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
          <Tooltip title={switchState ? "Deshabilitar" : "Habilitar"}>
            <Switch
              style={switchStyle}
              checked={switchState}
              onChange={handleSwitchClick}
            />
          </Tooltip>
          )}
        </CardContent>
      </Card>
    
  );
};

export default BankCard;
