import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import IdentityVerification from './components/IdentityVerification';
import ChatWindow from './components/ChatWindow';
import ObjectionForm from './components/ObjectionForm';
import IDCopyPage from './components/IDCopyPage';
import SignatureVerificationPage from './components/SignatureVerificationPage';
import AdditionalDataPage from './components/AdditionalDataPage';
import ObjectionStoragePage from './components/ObjectionStoragePage';
import PreviousRequestPage from './components/PreviousRequestPage';
import EditObjectionForm from './components/EditObjectionForm';
import EditIDCopyPage from './components/EditIDCopyPage';
import EditSignatureVerificationPage from './components/EditSignatureVerificationPage';
import EditAdditionalDataPage from './components/EditAdditionalDataPage';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/verify" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ChatWindow />} />
          <Route path="/verify" element={<IdentityVerification />} />
          <Route path="/objection" element={<RequireAuth><ObjectionForm /></RequireAuth>} />
          <Route path="/id-copy" element={<RequireAuth><IDCopyPage /></RequireAuth>} />
          <Route path="/signature-verification" element={<RequireAuth><SignatureVerificationPage /></RequireAuth>} />
          <Route path="/additional-data" element={<RequireAuth><AdditionalDataPage /></RequireAuth>} />
          <Route path="/edit-objection" element={<RequireAuth><EditObjectionForm /></RequireAuth>} />
          <Route path="/edit-id-copy" element={<RequireAuth><EditIDCopyPage /></RequireAuth>} />
          <Route path="/edit-signature-verification" element={<RequireAuth><EditSignatureVerificationPage /></RequireAuth>} />
          <Route path="/edit-additional-data" element={<RequireAuth><EditAdditionalDataPage /></RequireAuth>} />
          <Route path="/objection-data-storage" element={<RequireAuth><ObjectionStoragePage /></RequireAuth>} />
          <Route path="/previous-request" element={<RequireAuth><PreviousRequestPage /></RequireAuth>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
