import BankList from "@/components/BankList";
import { useEffect, useState } from "react";
import apiClient from "../../../apiClient";

function Banks () {

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
      <BankList banks={banks}/>
    </div>
  );
}

export default Banks;
