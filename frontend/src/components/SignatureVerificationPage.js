import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/SignatureVerificationPage.css'; // Ensure this points to your CSS file
import uploadIcon from '../assets/icons/upload_icon.svg'; // Ensure the correct icon is used
import closeIcon from '../assets/icons/close.svg'; // Ensure the correct close icon is used

const SignatureVerificationPage = () => {
  const { completeAction, resetAction } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      completeAction('signatureVerification'); // Mark the action as completed
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    resetAction('signatureVerification'); // Reset the action if the file is deleted
  };

  const handleSubmit = () => {
    if (file) {
      alert('파일이 제출되었습니다.');
      navigate('/');
    } else {
      alert('파일을 먼저 업로드해주세요.');
    }
  };

  return (
    <div className="signature-verification-page">
      <header className="sv-header">
        <p className="sv-header-text">본인서명사실확인서</p>
        <button className="sv-close-button" onClick={() => navigate('/')}>
          <img src={closeIcon} alt="Close" />
        </button>
      </header>
      <div className="content">
        <div className='sv-subheader'>
          <h2>첨부파일 업로드</h2>
        </div>
        <div className="link-container">
          <a href="https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A01008&CappBizCD=13110000047&tp_seq=" target="_blank" rel="noopener noreferrer">
            정부 24에서 발급받기
          </a>
        </div>

        {file ? (
          <div className="sv-file-name-box">
            <span className="file-name">{file.name}</span>
            <button className="delete-button" onClick={handleDeleteFile}>✖</button>
          </div>
        ) : (
          <label htmlFor="signature-verification-upload" className="sv-upload-box">
            <img src={uploadIcon} alt="Upload Icon" />
            <span>파일 업로드</span>
            <input
              id="signature-verification-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: 'none' }}
            />
          </label>
        )}

        <p className="file-info">파일은 PDF 형태로만 업로드할 수 있습니다.</p>
      </div>

      <footer className="sv-footer">
        <button className="sv-submit-button" onClick={handleSubmit} disabled={!file}>첨부 완료</button>
      </footer>
    </div>
  );
};

export default SignatureVerificationPage;
