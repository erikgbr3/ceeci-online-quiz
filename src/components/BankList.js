import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import AddBank from './modals/AddBank';
import apiClient from '../../apiClient';
import { useRouter } from 'next/router';
import BankCard from './cards/bankCard';
import useNavigation from '@/pages/api/routes/routes';
import { useSession } from "next-auth/react";

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

  const [switchStates, setSwitchStates] = useState({});
  const { data: session } = useSession();
  console.log('User Session:', session);

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
  
      let endpoint = "/api/banks";
      const offset = (page - 1) * banksPerPage;
  
      if (roomId) {
        endpoint += `?roomId=${roomId}&offset=${offset}&limit=${banksPerPage}`;
      } else {
        if (session?.user?.rol === 'usuario') {
          endpoint += `?enabled=true&offset=${offset}&limit=${banksPerPage}`;
        } else {
          endpoint += `?offset=${offset}&limit=${banksPerPage}`;
        }
      }
  
      const response = await apiClient.get(endpoint);
  
      const fetchedBanks = response.data.reduce((acc, bank) => {
        acc[bank.id] = { isEnabled: bank.enabled };
        return acc;
      }, {});
  
      // Update bankList with the fetched data
      setSwitchStates(fetchedBanks);
      setBankList(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (roomId && currentPage) {
      fetchBanks(roomId, currentPage);
    }
  }, [roomId, currentPage]);

  useEffect(() => {
    if (dataUpdate) {
      dataBanksUpdate();
    }
  }, [dataUpdate, currentPage, roomId]);

  useEffect(() => {
    if (roomId) {
      fetchBanks(roomId, currentPage);
    }
  }, [roomId]);

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

  const renderBanks = () => {
    const indexOfLastBank = currentPage * banksPerPage;
    const indexOfFirstBank = indexOfLastBank - banksPerPage;
    const currentBanks = bankList.slice(indexOfFirstBank, indexOfLastBank);

    let filteredBanks;

  if (session?.user?.rol === 'usuario') {
    // Filter only if the user role is 'usuario'
    filteredBanks = currentBanks.filter((bank) => switchStates[bank.id]?.isEnabled === true);
    
    // Check if there are no banks after filtering
    if (filteredBanks.length === 0) {
      console.log("No hay bancos habilitados por el momento. Displaying message.");
      return (
        <Typography variant="body1" style={{ textAlign: 'center', marginTop: '20px' }}>
          No hay salas habilitadas por el momento.
        </Typography>
      );
    }
  } else {
    // For other roles, include all banks without filtering
    filteredBanks = currentBanks;
  }

    console.log("Filtered Banks:", filteredBanks);

    return filteredBanks.map((bank) => (
      <BankCard 
        key={bank.id} 
        bank={bank} 
        switchState={switchStates[bank.id]}
        onClick={() => handleBanksClick(bank)}
      />
    ));
  };

  return (
    <div>
      <Box>
        <Paper style={{ padding: '16px' }}>
          <Typography sx={{ display: 'flex', justifyContent: 'Center', fontSize: 25, fontWeight: 'bold' }}>
            Bancos
          </Typography>
          {(session?.user?.rol === 'administrador' || session?.user?.rol === 'maestro') && (
            <AddBank
              recharge={() => {
                setBankList(banks);
                updateDataBanks();
              }}
            />
          )}
          {loading ? (
            <Typography>Cargando...</Typography>
          ) : bankList.length > 0 ? (
            renderBanks()
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
