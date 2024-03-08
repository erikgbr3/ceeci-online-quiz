import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  IconButton,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import apiClient from "../../../apiClient";
import RefreshIcon from '@mui/icons-material/Refresh';

function ViewAnsweredQuestions({ open, onClose, questionId, question, userAnswers }) {
  console.log('User Answers in ViewAnsweredQuestions:', userAnswers);
  
  const [answeredUsers, setAnsweredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  

  // const [scrollPosition, setScrollPosition] = useState(0);


  const fetchAnsweredUsers = async () => {
    console.log('Executing fetchAnsweredUsers');
    try {
      setLoading(true);

      const response = await apiClient.get(`/api/users?questionId=${questionId}`);
      const data = response.data;

      console.log('Fetched Answered Users Data:', data);

      const usersWithAnswer = userAnswers.filter(answer => answer.UserAnswer && answer.UserAnswer.length > 0);
      const filteredUsers = usersWithAnswer.filter(answer => answer.UserAnswer.some(userAnswer => userAnswer.questionId === question.id));
      setAnsweredUsers(filteredUsers);

    } catch (error) {
      console.error('Error fetching answered users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchAnsweredUsers();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnsweredUsers();
  }, [questionId, userAnswers]);

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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      component="form"
      // scroll="paper"
      // PaperProps={{
      //   style: {
      //     maxHeight: "80vh",
      //   },
      // }}
    >
      <DialogTitle
        color="textSecondary"
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {`Usuarios que respondieron a la pregunta: ${question.textQuestion}`}
      </DialogTitle>
      
      {/* <DialogContent onScroll={handleScroll} id="scrollable-content"> */}
      <DialogContent>
        {loading ? (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress size={50} />
            </div>
          ) : (
            <DialogContentText>
              <Grid container spacing={2} mt={0}>
                <Table aria-label="User Table">
                <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#223354', fontWeight: "800" }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#223354', fontWeight: "800" }}>Fecha y Hora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {answeredUsers.map((user, index) => {
                  const userAnswer = user.UserAnswer.find(answer => answer.questionId === question.id);
                  return (
                    <TableRow key={index}>
                      <TableCell>{`${user.name} ${user.lastName}`}</TableCell>
                      <TableCell>{formatDateTime(userAnswer.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
                {answeredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <p style={{ color: '#ff0000' }}>Ningún usuario ha respondido a esta pregunta.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
                </Table>
              </Grid>
            </DialogContentText>
          )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          marginRight: "80px",
          marginLeft: "80px",
          marginBottom: "5px",
        }}
      >
        <IconButton onClick={handleRefresh} disabled={loading} color="primary">
          <RefreshIcon />
        </IconButton>
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<CancelIcon />}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewAnsweredQuestions;

