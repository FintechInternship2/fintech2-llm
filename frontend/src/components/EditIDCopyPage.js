import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/IDCopyPage.css';

const EditIDCopyPage = () => {
  const { completeAction } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file && file.type === 'image/png') {
      completeAction('idCopy');
      alert('신분증 사본이 업로드되었습니다.');
      navigate('/objection-data-storage');
    } else {
      alert('PNG 파일만 업로드 가능합니다.');
    }
  };

  return (
    <div className="upload-page">
      <h1>신분증 사본 업로드</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".png" />
        <button type="submit">업로드</button>
      </form>
    </div>
  );
};

export default EditIDCopyPage;
