import React from "react";
import {
  Paper,
  Typography,
  Button,
  CardMedia,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";

function Home({ user }) {
  const router = useRouter();
  const handleLoginClick = () => {
    // Redirige a la página de login
    router.push('/login');
  };
  return (
    <Paper sx= {{width: '100%', height: '100%',  padding: 1}}>
      <Grid container spacing={2} mt={0}>
        <Grid item xs={6} sx={{ display: 'flex'}}>
          <Typography
            sx={{
              padding: "10px",
              fontSize: 35,
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#30315A",
            }}
          >
            CEECI
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            sx={{
              fontWeight: "bold",
              fontSize: 16,
              padding: "10px 30px", 
              width: '200px',
              textAlign: "center", 
              color: "#30315A",
              
            }}
            onClick={handleLoginClick}
          >
            Iniciar sesión
          </Button> 
          </Grid>       
      </Grid>
      
      <Typography
        sx={{
          marginTop: 1,
          fontSize: 20,
          display: "flex",
          justifyContent: "center",
          marginBottom: 3,
          color: "#30315A",
        }}
      >
        Siempre un paso adelante. Educación profesional para tu futuro.
      </Typography>

      <CardMedia
        component="img"
        alt="Imagen"
        image='././imgHome.jpg'
        sx={{
          width: '100%', 
          maxWidth: '100%', 
          height: 'auto',
          margin: "auto",
          display: "block",
          borderRadius: 5,
          marginBottom: 5,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 14,
          marginBottom: 2,
        }}
      >
      </div>
    </Paper>
  );
}

export default Home;
