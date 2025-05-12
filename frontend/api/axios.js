import axios from "axios";

const api = axios.create({
  baseURL: "http://10.2.145.42:3000", // Make sure this is correct
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
