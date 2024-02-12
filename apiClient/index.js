import axios from "axios";

const apiClient = axios.create({
    baseUrl: '/api'
});

export default apiClient;