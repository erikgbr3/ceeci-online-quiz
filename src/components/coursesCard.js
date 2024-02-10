import * as React from 'react';
import Link from '@mui/material/Link';
import {  Box, Paper, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { useState, useEffect } from "react";
import AddQuestion from "./modals/AddQuestion";

const CardCourse = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const changePage = (event, newPage) => {
      setCurrentPage(newPage);
    };
    
    return (
        <Box>
            <Paper>
                <Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold', }}>
                    Categorias
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
                    <AddQuestion/>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px'  }}>

                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/arte.jpg"
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Diseño artistico
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
            
                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/admon.jpg"
                        />
                        <CardContent sx={{textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Administración
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                    
                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="testing.jpg"
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Testing
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/lider.jpg"
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Líder técnico
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/ingles.jpg"
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Inglés
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                
                    <Card sx={{ width: '300px', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/quimica.jpg"
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                            Quimica
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>

                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            page={currentPage}
                            onChange={changePage}
                     />
                </Box>
            </Paper>
        </Box>
    );
};

export default CardCourse
