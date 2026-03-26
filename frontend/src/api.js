import axios from 'axios';

// Backend ka URL (MERN stack mein default 5000 hota hai)
const API = axios.create({ 
    baseURL: 'http://localhost:5000/api' 
});

// Request Interceptor: Har request ke saath JWT token bhejne ke liye
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export default API;