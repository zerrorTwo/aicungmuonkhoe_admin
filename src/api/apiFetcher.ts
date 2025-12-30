import axios from "axios";

const apiFetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api", // Adjust base URL as needed
});

apiFetcher.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiFetcher;
