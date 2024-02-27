  import React from "react";
  import {
    Paper,
    Typography
  } from "@mui/material";

  function HomePage() {
    return (
      <Paper>
        <Typography
          sx={{
            fontSize: 35,
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          CEECI
        </Typography>

        <Typography
          sx={{
            marginTop: 1,
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Organizacion que ...
        </Typography>

        <Typography
          sx={{
            marginTop: 1,
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold"
          }}
        >
            Somos una empresa dedicada a ...
        </Typography>
      </Paper>
    );
  }

  export default HomePage;
