import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-home-production-79e1.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
