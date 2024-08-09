import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/IDCopyPage.css';
import uploadIcon2 from '../assets/icons/upload_icon2.svg';
import closeIcon from '../assets/icons/close.svg'; // Import the close icon

const EditIDCopyPage = () => {
  const { completeAction } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    completeAction('idCopy');
    alert('신분증 사본이 수정되었습니다.');
    navigate('/objection-data-storage');
  };

  return (
    <div className="idcopy-page">
      <div className="idc-header">
        <p className="idc-header-text"> 신분증 사본</p>
        <button className="idc-close-button" onClick={() => navigate('/objection-data-storage')}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      <div className='middle'></div>
      <div className="form-content">
        <div className="upload-section">
          <label htmlFor="idcopy-file-upload" className="idcopy-file-upload-label">
            {file ? (
              <img src={URL.createObjectURL(file)} alt="Preview" className="file-preview" />
            ) : (
              <div className="upload-placeholder">
                <img src={uploadIcon2} alt="Upload Icon" />
                <span>이미지 업로드</span>
              </div>
            )}
            <input id="idcopy-file-upload" type="file" onChange={handleFileChange} accept=".png,.jpg,.jpeg" />
          </label>
          <span className="file-info">5MB 이하의 이미지(jpg)만 첨부 가능해요</span>
        </div>
      </div>
      <div className='middle'></div>
      <div className="idc-footer">
        <button type="submit" className='footer-button2' onClick={handleSubmit} disabled={!file}>수정 완료</button>
      </div>
    </div>
  );
};

export default EditIDCopyPage;
