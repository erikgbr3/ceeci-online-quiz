import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import Typography from '@mui/material/Typography';
import apiClient from "../../apiClient";
import AddQuestion from "./modals/AddQuestion";
import QuestionCard from "./cards/questionCard";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import QuestionCardStudent from "./cards/questionCardStudent";


const QuestionList = () => {
  const router = useRouter();
  // Obtiene el valor actual del bankId desde el enrutador de Next.js
  const { bankId } = router.query;
  console.log('bankId in Questions component:', bankId);
  // Estado para almacenar las preguntas
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para la página actual en la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 200;
  const [options, setOptions] = useState([]);

  // Estado para manejar el estado de los interruptores de cada pregunta
  const [questionStates, setQuestionStates] = useState({});
    // Estado para actualizar la información de los bancos
  const [dataUpdate, setDataUpdate] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  const [switchStates, setSwitchStates] = useState({});
  const { data: session } = useSession();
  console.log('User Session:', session);


  // // Función para indicar que se deben actualizar los datos de los bancos
  const updateDataQuestions = () => {
    setDataUpdate(true);
  };

  // Función para realizar la actualización de los datos de los bancos
  const dataQuestionsUpdate = () => {
    fetchQuestions(bankId, currentPage);
    setDataUpdate(false);
  };

  
  // Función asincrónica para obtener la lista de preguntas desde el servidor
  const fetchQuestions = async (bankId, page) => {
    try {
      setLoading(true);
      let endpoint = "/api/questions";
      // Calcula el índice de inicio de las preguntas a obtener
      const offset = (page - 1) * questionsPerPage;

      if (bankId) {
        // Obtiene las preguntas basados en bankId si está presente
        endpoint += `?bankId+${bankId}&offset=${offset}&limit=${questionsPerPage}`;
      } else {
        if (session?.user?.rol === 'usuario') {
          endpoint += `?enabled=true&offset=${offset}&limit=${banksPerPage}`;
        } else {
        // Obtiene todos las preguntas si no hay bankId presente
        endpoint += `?offset=${offset}&limit=${questionsPerPage}`;
        }
      }

      const response = await apiClient.get(endpoint);

      // Inicializa el estado de las interruptores para cada banco
      const fetchedQuestions = response.data.reduce((acc, question) => {
        acc[question.id] = { isEnabled: question.enabled };
        return acc;
      }, {});

      // Actualiza la lista de preguntas con las datos obtenidos
      setSwitchStates(fetchedQuestions);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };


  // Efecto que se ejecuta cuando cambia bankId
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       let response;

  //       // Obtiene la lista de bancos basados en bankId
  //       response = await apiClient.get(`/api/questions?bankId=${bankId}`);
  //       // Inicializa el estado de los interruptores para cada banco
  //       const fetchedQuestions = response.data.reduce((acc, question) => {
  //         acc[question.id] = { isEnabled: false };
  //         return acc;
  //       }, {});
  //       // Actualiza la lista de bancos con los datos obtenidos
  //       setQuestionStates(fetchedQuestions);
  //       setQuestions(response.data);
  //     } catch (error) {
  //       console.error('Error fetching questions:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (bankId !== undefined) {
  //     fetchData();
  //   }
  // }, [bankId]);

  // Efecto que se ejecuta cuando cambia bankId o currentPage
  useEffect(() => {
    if (bankId && currentPage) {
      fetchQuestions(bankId, currentPage);
    }
  }, [bankId, currentPage]);

  // Efecto que se ejecuta cuando hay una actualización de datos o se cambia la página actual
  useEffect(() => {
    if (dataUpdate) {
      dataQuestionsUpdate();
    }
  }, [dataUpdate, currentPage]);

  useEffect(() => {
    if (bankId) {
      fetchQuestions(bankId, currentPage);
    }
  }, [bankId]);


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
              fetchQuestions();
            })
            .catch((error) => {
              console.log("Error al eliminar question:", error);
            });
        }
      });
    };

  const optionId = questions.optionId
  const questionOptions = options.find(option => option.id === optionId) || {};

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const renderQuestions = () => {
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    let filteredQuestions;

    if (session?.user?.rol === 'usuario') {
      // Filter only if the user role is 'usuario'
      filteredQuestions = currentQuestions.filter((question) => switchStates[question.id]?.isEnabled === true);
      
      // Check if there are no banks after filtering
      if (filteredQuestions.length === 0) {
        console.log("No hay bancos habilitados por el momento. Displaying message.");
        return (
          <Typography variant="body1" style={{ marginTop: '15px', textAlign: 'center', width: '100%' }}>
            No hay questions habilitados por el momento.
          </Typography>
        );
      }
    } else {
      // For other roles, include all banks without filtering
      filteredQuestions = currentQuestions;
    }

      console.log("Filtered Banks:", filteredQuestions);
    
    return filteredQuestions.map((question, index) => (
      <Grid item key={question.id} xs={12} md={6}>
        <QuestionCard
          question={question}
          index={index}
          options={options.find(option => option.id === question.optionId)}
          onDelete={deleteQuestion}
          onSaved={fetchQuestions}
          onUpdate={(updatedItem) => updateItem(questions, setQuestions, updatedItem)}
          questionStates={questionStates} 
          userAnswers={userAnswers}  
          switchState={switchStates[question.id]}
        />
      </Grid>
    ));
  };

  return (
    <Box>
      <Paper>
        <Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold' }}>
          {questions[0]?.QuestionBank?.name || ''}
         </Typography>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end"}}>
            {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
              <AddQuestion 
                recharge={() => {
                  setQuestions(questions);
                  updateDataQuestions();
                }}
              />
            )}
          </Grid>
           {loading ? (
              <Typography>Cargando...</Typography>
            ) : (
              <React.Fragment>
                <Grid container spacing={2} sx={{ display: 'flex' }}>
                  {renderQuestions()}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={changePage}
                  />
                </Box>
                {questions.length === 0 && (
                  <Typography>
                    {bankId
                      ? 'Este banco no contiene preguntas aún.'
                      : 'Selecciona un banco para ver sus preguntas.'
                    }
                  </Typography>
                )}
              </React.Fragment>
            )}
      </Paper>
    </Box>
  );
};

export default QuestionList;
