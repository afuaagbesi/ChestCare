import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  // Check if there's saved auth state in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage whenever auth state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', userRole || '');
    localStorage.setItem('user', user ? JSON.stringify(user) : '');
  }, [isAuthenticated, userRole, user]);

  // Login function - accepts email, role and user info
  const login = (email, role, userData) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      user,
      login, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 