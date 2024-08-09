import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/AdditionalDataPage.css'; // Updated CSS file
import uploadIcon from '../assets/icons/upload_icon.svg'; // Use the same upload icon
import closeIcon from '../assets/icons/close.svg'; // Import the close icon

const AdditionalDataPage = () => {
  const { completeAction, resetAction } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 30) {
      alert('최대 30개의 파일만 업로드할 수 있습니다.');
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setFile(!file);
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (files.length === 1) {
      resetAction('additionalData'); // Reset the action if no files left
      setFile(!file);
    }
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      alert('추가 자료가 제출되었습니다.');
      completeAction('additionalData'); // Mark the action as completed
      navigate('/');
    } else {
      alert('파일을 먼저 업로드해주세요.');
    }
  };

  return (
    <div className="additional-data-page">
      <header className="adp-header">
        <div className="adp-header-text">
          <p>증빙자료</p>
        </div>
        <button className="adp-close-button" onClick={() => navigate('/')}>
          <img src={closeIcon} alt="Close" />
        </button>
      </header>
      
      <div className="ad-content">
        <p>첨부파일 업로드</p>
        <div className='additional-text-container'>
          <div className='additional-text-box'>
            <div className='additional-text'>해당 계좌가 사기이용계좌가 아님을 증빙할 수 있는 객관적인 자료를 첨부해주세요. 대화 기록, 통장 거래 내역, 통화 녹음 내역, 신고 관련 서류 등 사기에 이용된 계좌가 아님을 증명할 수 있는 모든 자료에 해당합니다.</div>
          </div>
        </div>
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-name-box">
              <span className="file-name">{file.name}</span>
              <button className="delete-button" onClick={() => handleDeleteFile(index)}>✖</button>
            </div>
          ))}
        </div>

        <label htmlFor="additional-data-upload" className="ad-upload-box">
          <img src={uploadIcon} alt="Upload Icon" />
          <span>파일 업로드</span>
          <input
            id="additional-data-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf, .png, .jpg, .jpeg, .xlsx, .mp4, .hwp, .pptx"
            style={{ display: 'none' }}
            multiple
          />
        </label>
        <div className="file-info">파일은 jpng, pdf, mp3, mp4 형태로만 업로드할 수 있습니다.</div>
      </div>

      <div className="ad-footer">
        <button className="ad-submit-button" onClick={handleSubmit} disabled={!file}>제출하기</button>
      </div>
    </div>
  );
};

export default AdditionalDataPage;
