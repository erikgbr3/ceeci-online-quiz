import React, { useState } from 'react';
import { Card, CardContent, Switch, Typography } from '@mui/material';
import useNavigation from '@/pages/api/routes/routes';

const BankCard = ({ bank, bankStates, toggleCardEnabled }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { navigateToQuestionsCreation } = useNavigation();

  const handleCardClick = () => {
    console.log("handleCardClick executed");
    navigateToQuestionsCreation(bank.id);  // Llama a la función onClick cuando se hace clic en la tarjeta
  }

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
          <Switch
            checked={bankStates[bank.id]?.isEnabled || false}
            onChange={() => toggleCardEnabled(bank.id)}
            style={switchStyle}
          />
        </CardContent>
      </Card>
    
  );
};

export default BankCard;
