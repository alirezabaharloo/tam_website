import axios from 'axios';

export const apiAuth = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem("language"),
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access || ''}`
  },
  withCredentials: false, // set true if you use cookies/auth
});

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem("language"),
  },
  withCredentials: false, // set true if you use cookies/auth
});

apiAuth.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error); // ✅ IMPORTANT
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error); // ✅ IMPORTANT
  }
);


export default api;