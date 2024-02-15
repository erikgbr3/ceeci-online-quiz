
import CardCourse from "@/components/coursesCard";
import AddQuestion from "@/components/modals/AddQuestion";

import CardCourse from "@/components/roomsCard";

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
    <h1>Hola</h1>

    <CardCourse/>

    </div>
  );
}

export default Quizes;