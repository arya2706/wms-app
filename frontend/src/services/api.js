import axios from "axios";

const token = localStorage.getItem("token") || "";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export default api;
