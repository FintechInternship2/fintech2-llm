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

  const [submissions, setSubmissions] = useState([]);

  const submitDocuments = () => {
    const date = new Date().toISOString().split('T')[0];
    const newSubmission = {
      status: '제출완료',
      date,
      documents: [
        '이의제기신청서',
        '신분증사본',
        '본인서명사실확인서',
        '증빙자료(선택)'
      ],
      id: `2024${Math.floor(Math.random() * 1000000)}` // Random ID for example
    };
    setSubmissions([...submissions, newSubmission]);

    // Mark all documents as submitted
    setCompletedActions({
      objection: 'submitted',
      idCopy: 'submitted',
      signatureVerification: 'submitted',
      additionalData: 'submitted',
    });
  };

  const resetCompletedActions = () => {
    setCompletedActions({
      objection: false,
      idCopy: false,
      signatureVerification: false,
      additionalData: false,
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      authenticate,
      completedActions,
      completeAction,
      resetAction,
      submissions,
      submitDocuments,
      resetCompletedActions
    }}>
      {children}
    </AuthContext.Provider>
  );
};
