import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem("language"),
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access || ''}`
  },
  withCredentials: false, // set true if you use cookies/auth
});

export default api;