import axios from "axios";
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Something went wrong. Please try again.';

    if (error?.response?.data?.message) {
      message = error.response.data?.message;
    }

    Alert.alert('Error', message);

    return Promise.reject(error);
  }
);

export default api;
