import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt_token"));

  // This function will be called by your Login page
  const login = (token) => {
    localStorage.setItem("jwt_token", token);
    setIsLoggedIn(true);
  };

  // This function will be called by the Navbar
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);