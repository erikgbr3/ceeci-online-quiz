import apiClient from "../../apiClient";
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
// import listUser from "./listUser";
import Pagination from "@mui/material/Pagination";
import ResultTable from "./ResultTable";

const ResultList = ({ bankId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  // const router = useRouter();
  // const { bankId } = router.query;
  const [questions, setQuestions] = useState([]);
  // const [report, setReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 1000;

  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = users.filter((user) => {
      const fullName = `${user.name} ${user.lastName}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      return fullName.includes(search);
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const loadData = async () => {
    try {
      const usersResponse = await apiClient.get("/api/users");
      setUsers(usersResponse.data || []);
      setFilteredUsers(usersResponse.data);
  
      const questionsResponse = await apiClient.get(`/api/questions?bankId=${bankId}`);
      setQuestions(questionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (bankId) {
      loadData();
    }
  }, [bankId]);

  const renderUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return currentUsers.map((user) => (
      <ResultTable
        user={user}
        // report={report.find((r) => r.userId === user.id)}
        questions={questions}
        onSaved={loadData}
        key={user.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  

  return (
    <Box>
       <Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold',  }}>
          Calificaciones del examen: {questions[0]?.QuestionBank?.name || ''}
        </Typography>
      <Paper>
        <Box sx={{ display: "flex", marginBottom: "16px"}}>
        <TextField
          placeholder="Buscar usuario"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange} 
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        </Box>
        <div style={{ overflowX: "auto" }}>
          <TableContainer component={Paper}>
          <Table aria-label="User Table">
            <TableHead sx={{ background: '#f5f5f5'}}>
              <TableRow>
                <TableCell sx={{ color: '#223354', fontWeight: "500" }}>NOMBRE</TableCell>
                {questions.map((question, index) => (
                    <TableCell key={question.id} sx={{ color: '#223354', fontWeight: "500" }}>{`P. ${index + 1}`}</TableCell>
                ))}

                <TableCell sx={{ color: '#223354', fontWeight: "500" }}>TOTAL</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "500" }}>CALIFICACIÓN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderUsers()}</TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={changePage}
          />
        </Box>
        </TableContainer>
        </div>
      </Paper>
    </Box>
  );
};

export default ResultList;
