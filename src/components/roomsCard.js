import * as React from "react";
import { useState, useEffect } from "react";
import {
    Box,
    Paper,
  } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import Typography from '@mui/material/Typography';
import apiClient from "../../apiClient";
import ListCategory from "./listRooms";
import AddRooms from "./modals/AddRooms";

const CardCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = rooms.filter((room) => {
      const fullName = `${room.name}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      return fullName.includes(search);
    });

    setFilteredRooms(filtered);
    setCurrentPage(1);
  };

  const loadRooms = () => {
    console.log('Se recargó');
    apiClient.get("/api/rooms")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setRooms(response.data || []);
        setFilteredRooms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const updateRooms = (room) => {
    console.log(room);
    const roomsCopy = [...rooms];
    const index = roomsCopy.findIndex(item => item.id == room.id);
    console.log(index);
    roomsCopy.splice(index, 1, room)
    setRooms([...roomsCopy]);
    setFilteredRooms([...roomsCopy]);
  }

  const renderRooms = () => {
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    
    return currentRooms.map((room) => (
      <ListCategory
        room={room}
        onDelete={deleteRoom}
        onSaved={loadRooms}
        onUpdate={updateRooms}
        key={room.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const deleteRoom = (id) => {
    console.log("ID a eliminar:", id); 
    Swal.fire({
      title: "¿Estás Seguro de eliminar?",
      text: "Los datos relacionados con el usuario se perderán permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Eliminar usuario con ID:", id); 
        apiClient.delete(`/api/rooms?id=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar"
            });
            loadRooms();
          })
          .catch((error) => {
            console.log("Error al eliminar usuario:", error);
          });
      }
    });
  };

  return (
    <Box>
      <Paper>
        <Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold' }}>
          Rooms
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AddRooms recharge={loadRooms} />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
          {renderRooms()}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={changePage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CardCourse;