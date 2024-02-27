import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import AddBank from './modals/AddBank';
import apiClient from '../../apiClient';
import { useRouter } from 'next/router';
import BankCard from './cards/bankCard';
import useNavigation from '@/pages/api/routes/routes';

const BankList = ({ banks }) => {
  const router = useRouter();
  const navigation = useNavigation();

  const [dataUpdate, setDataUpdate] = useState('');
  const { roomId } = router.query;
  console.log('roomId in Banks component:', roomId);

  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const banksPerPage = 6;
  const [selectedBank, setSelectedBank] = useState(null);

  const [bankStates, setBankStates] = useState({});

  const updateDataBanks = () => {
    setDataUpdate(true);
  };

  const dataBanksUpdate = () => {
    fetchBanks(roomId, currentPage);
    setDataUpdate(false);
  };

  const fetchBanks = async (roomId, page) => {
    try {
      setLoading(true);

      let response;

      const offset = (page - 1) * banksPerPage;

      if (roomId) {
        // Fetch banks based on roomId if it is present
        response = await apiClient.get(`/api/banks?roomId=${roomId}&offset=${offset}&limit=${banksPerPage}`);
      } else {
        // Fetch all banks if no roomId is present
        response = await apiClient.get(`/api/banks?offset=${offset}&limit=${banksPerPage}`);
      }

      const fetchedBanks = response.data.reduce((acc, bank) => {
        acc[bank.id] = { isEnabled: false };
        return acc;
      }, {});

      // Update bankList with the fetched data
      setBankStates(fetchedBanks);
      setBankList(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        setLoading(true);
        response = await apiClient.get(`/api/banks?roomId=${roomId}`);
        const fetchedBanks = response.data.reduce((acc, bank) => {
          // Inicializando el estado del interruptor para cada banco
          acc[bank.id] = { isEnabled: false };
          return acc;
        }, {});
        setBankStates(fetchedBanks);
        setBankList(response.data);
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  useEffect(() => {
    if (dataUpdate) {
      dataBanksUpdate();
    }
  }, [dataUpdate, currentPage]);

  useEffect(() => {
    if (roomId && currentPage) {
      fetchBanks(roomId, currentPage);
    }
  }, [roomId, currentPage]);

  const cardStyle = {
    marginBottom: '16px',
    backgroundColor: '#f5f5f5',
    marginLeft: '90px',
    marginRight: '90px',
  };

  const totalPages = Math.ceil(bankList.length / banksPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleBanksClick = (bank) => {
    console.log("handleBanksClick executed"); // Añade este log
    console.log("Clicked BAnk ID:", bank.id);
    setSelectedBank(bank);
    console.log("Selected Bank after set:", selectedBank);
    navigation.navigateToQuestionsCreation(bank.id);
  };

  const toggleCardEnabled = (bankId) => {
    setBankStates((prevStates) => ({
      ...prevStates,
      [bankId]: {
        isEnabled: !prevStates[bankId]?.isEnabled,
      },
    }));
  };

  const indexOfLastBank = currentPage * banksPerPage;
  const indexOfFirstBank = indexOfLastBank - banksPerPage;
  const currentBanks = bankList.slice(indexOfFirstBank, indexOfLastBank);

  return (
    <div>
      <Box>
        <Paper style={{ padding: '16px' }}>
          <Typography sx={{ display: 'flex', justifyContent: 'Center', fontSize: 25, fontWeight: 'bold' }}>
            Bancos
          </Typography>
          <AddBank
            recharge={() => {
              setBankList(banks);
              updateDataBanks();
            }}
          />
          {loading ? (
            <Typography>Cargando...</Typography>
          ) : currentBanks.length > 0 ? (
            currentBanks.map((bank) => (
              <BankCard 
                key={bank.id} 
                bank={bank} 
                bankStates={bankStates} 
                toggleCardEnabled={toggleCardEnabled} 
                onClick={() => handleBanksClick(bank)}
              />
            ))
          ) : (
            <Typography>
              {roomId
                ? 'No hay bancos asociados a esta sala.'
                : 'Selecciona una sala para ver los bancos asociados.'
              }
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination count={totalPages} page={currentPage} onChange={changePage} />
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default BankList;
