import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // 원래 본인인증해야돼서 false인데, 본인인증 개발중이라 일단 스킾하게 해둠
  const [completedActions, setCompletedActions] = useState({
    objection: false,
    idCopy: false,
    signatureVerification: false,
    additionalData: false,
  });

  const authenticate = () => setIsAuthenticated(true);

  const completeAction = (action) => {
    setCompletedActions((prev) => ({
      ...prev,
      [action]: true,
    }));
  };

  const resetAction = (action) => {
    setCompletedActions((prev) => ({
      ...prev,
      [action]: false,
    }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, completedActions, completeAction, resetAction }}>
      {children}
    </AuthContext.Provider>
  );
};
