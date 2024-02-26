
import * as React from "react";
import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    InputAdornment,
    Paper,
    TextField,
  } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import Typography from '@mui/material/Typography';
import apiClient from "../../apiClient";
import AddQuestion from "./modals/AddQuestion";
// import useNavigation from "@/pages/api/routes/routes";
// import ListRooms from "../listRooms";
import QuestionCard from "./cards/questionCard";
import SearchIcon from '@mui/icons-material/Search';


const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 200;

  const [options, setOptions] = useState([]);

  const loadQuestions = () => {
    console.log('Se recargó');
    apiClient.get("/api/questions")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setQuestions(response.data || []);
        setFilteredQuestions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      apiClient.get("/api/options")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setOptions(response.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const loadOptions = () => {
  //   console.log('Se recargó');
  //   apiClient.get("/api/options")
  //     .then((response) => {
  //       console.log("Respuesta de la API:", response.data);
  //       setOptions(response.data || []);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };


  useEffect(() => {
    loadQuestions();
    // loadOptions();
  }, []);

  // const updateQuestions = (question) => {
  //   console.log(question);
  //   const questionsCopy = [...questions];
  //   const index = questionsCopy.findIndex(item => item.id == question.id);
  //   console.log(index);
  //   questionsCopy.splice(index, 1, question)
  //   setQuestions([...questionsCopy]);
  // }

  // const updateOptions = (option) => {
  //   console.log(option);
  //   const optionsCopy = [...options];
  //   const index = optionsCopy.findIndex(item => item.id == option.id);
  //   console.log(index);
  //   optionsCopy.splice(index, 1, option)
  //   setOptions([...optionsCopy]);
  // }

  // const handleQuestionsClick = () => {
  //   navigation.navigateToQuestionsCreation();
  // };

  const updateItem = (items, setItems, item) => {
    console.log(item);
    const itemsCopy = [...items];
    const index = itemsCopy.findIndex((i) => i.id === item.id);
    console.log(index);
    itemsCopy.splice(index, 1, item);
    setItems([...itemsCopy]);
  };
  
  // const updateQuestions = (question) => {
  //   updateItem(questions, setQuestions, question);
  // };
  
  // const updateOptions = (option) => {
  //   updateItem(options, setOptions, option);
  // };
  

  const deleteQuestion = (id) => {
      console.log("ID a eliminar:", id); 
      Swal.fire({
        title: "¿Estás Seguro de eliminar?",
        text: "Los datos relacionados con la pregunta se perderán permanentemente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Eliminar question con ID:", id); 
          apiClient.delete(`/api/questions?id=${id}`)
            .then((response) => {
              console.log("Respuesta del servidor:", response.data);
              Swal.fire({
                position: "center",
                icon: "success",
                text: response.data.message,
                confirmButtonText: "Aceptar"
              });
              loadQuestions();
            })
            .catch((error) => {
              console.log("Error al eliminar question:", error);
            });
        }
      });
    };

  const optionId = questions.optionId
  const questionOptions = options.find(option => option.id === optionId);

  const renderQuestions = () => {
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    
    return currentQuestions.map((question, index) => (
      <Grid item key={question.id} xs={12} md={6}>
        <QuestionCard
          question={question}
          index={index}
          options={options.find(option => option.id === question.optionId)}

          onDelete={deleteQuestion}
          onSaved={loadQuestions}
          //  onSaved={() => updateItem(questions, setQuestions, question)} // Llamar a la función de actualización
          // onUpdate={updateItem}
          onUpdate={(updatedItem) => updateItem(questions, setQuestions, updatedItem)}
          // onClick={() => handleQuestionsClick()}
        />
      </Grid>
      
    ));
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);


  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box>
      <Paper>
        <Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold' }}>
           Preguntas
         </Typography>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end"}}>
            <AddQuestion recharge={loadQuestions}/>
          </Grid>
        
          <Grid container spacing={2} sx={{ display: 'flex' }} >
            {renderQuestions()}
          </Grid>
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

export default QuestionList;
