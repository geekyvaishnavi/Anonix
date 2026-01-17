const BASE_URL = 'http://localhost:3000';

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
        // Important: Use 'include' if using Cookies, otherwise default is fine for JWT
        credentials: 'same-origin', 
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        // Handle 401 Unauthorized (e.g., token expired)
        if (response.status === 401) {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
            return;
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
