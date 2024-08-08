import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/AdditionalDataPage.css'

const EditAdditionalDataPage = () => {
  const { completeAction } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      completeAction('additionalData');
      alert('추가 자료가 성공적으로 업로드되었습니다!');
      navigate('/objection-data-storage');
    } else {
      alert('파일을 선택해 주세요.');
    }
  };

  return (
    <div className="upload-page">
      <h1>추가자료 업로드</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".png,.jpg,.jpeg" />
        <button type="submit">업로드</button>
      </form>
    </div>
  );
};

export default EditAdditionalDataPage;
