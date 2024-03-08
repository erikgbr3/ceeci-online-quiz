import * as React from "react";
import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Paper,
  } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import Typography from '@mui/material/Typography';
import apiClient from "../../apiClient";
import ListCategory from "./listRooms";
import AddRooms from "./modals/AddRooms";
import useNavigation from "@/pages/api/routes/routes";
import { useSession } from "next-auth/react";

const CardCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { data: session } = useSession();

  const navigation = useNavigation();

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
    let endpoint = "/api/rooms";

    if (session?.user?.rol === 'maestro') {
      endpoint += `?userId=${session.user.id}`;
    } else if (session?.user?.rol === 'usuario') {
      endpoint += `?enabled=true`;
    }

    apiClient.get(endpoint)
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

  const handleRoomsClick = (room) => {
    console.log("handleRoomsClick executed"); // Añade este log
    console.log("Clicked Room ID:", room.id);
    setSelectedRoom(room);
    console.log("Selected Room after set:", selectedRoom);
    navigation.navigateToBankCreation(room.id);
  };


  const renderRooms = () => {
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    if (currentRooms.length === 0 && session?.user?.rol === 'usuario') {
      return (
        <Typography variant="body1" style={{ textAlign: 'center', marginTop: '20px' }}>
          No hay salas habilitadas por el momento.
        </Typography>
      );
    }
    
    return currentRooms.map((room) => (
      <ListCategory
        room={room}
        onDelete={() => deleteRoom(room.id)}
        onSaved={loadRooms}
        onUpdate={updateRooms}
        key={room.id}
        onClick={() => handleRoomsClick(room)}
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
      confirmButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonColor: "#519581FF",
      cancelButtonText: "Cancelar",
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
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#519581FF',

            });
            setTimeout(() => {
              Swal.close();
            }, 1500);
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
        <Typography sx={{ display: "flex", justifyContent: "center", fontSize: 25, fontWeight: 'bold' }}>
          Salas
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
          <AddRooms recharge={loadRooms} />
        )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
            {renderRooms()}
          </Box>
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