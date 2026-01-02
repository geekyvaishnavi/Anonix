import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000', // Your Elysia URL
});

// Automatically add the token to every request if it exists
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;