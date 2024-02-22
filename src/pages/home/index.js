  import React from "react";
  import {
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    CardMedia,
  } from "@mui/material";
  import { Assignment, Devices, Settings } from "@mui/icons-material";
  import PeopleIcon from "@mui/icons-material/People";
  import List from "@mui/material/List";
  import ListItem from "@mui/material/ListItem";
  import ListItemText from "@mui/material/ListItemText";
  import ListItemAvatar from "@mui/material/ListItemAvatar";
  import Avatar from "@mui/material/Avatar";
  import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";

  import ImageIcon from "@mui/icons-material/Image";
  import WorkIcon from "@mui/icons-material/Work";
  import BeachAccessIcon from "@mui/icons-material/BeachAccess";

  function HomePage({ user }) {
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

        {/* <CardMedia
          component="img"
          alt="Imagen"
          image="https://reisdigital.es/wp-content/uploads/2022/10/los-mejores-software-y-hardware-para-tu-empresa.jpg"
          sx={{
            width: 600,
            margin: "auto",
            display: "block",
            borderRadius: 10,
          }}
        /> */}
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
