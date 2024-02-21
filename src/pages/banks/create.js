import BankList from '@/components/BankList';
import apiClient from "../../../apiClient";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const Banks = () => {
  const router = useRouter();

  const { roomId } = router.query;
  const [banks, setBanks] = useState([]);

  const fetchBanks = async (roomId) => {
    try {
      const response = await apiClient.get(`/api/banks?roomId=${roomId}`);
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  useEffect(() => {
    console.log('roomId in useEffect:', roomId);
    if (roomId) {
      fetchBanks(roomId);
    }
    
  },[roomId]);

  return (
    <div>
      <BankList banks={banks} roomId={roomId}/>
    </div>
  );
}

export default Banks;