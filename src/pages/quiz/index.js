import AddBank from "@/components/modals/AddBank";
import AddQuestion from "@/components/modals/AddQuestion";
import BankList from '@/components/BankList';
import apiClient from "../../../apiClient";
import { useEffect, useState } from "react";
function Quizes () {

  const [banks, setBanks] = useState([]);

  const fetchBanks = async () => {
    try {
      const response = await apiClient.get('/api/banks');
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div>
    <BankList banks={banks} />
    </div>
  );
}

export default Quizes;