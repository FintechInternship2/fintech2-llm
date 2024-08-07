import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import uploadIcon from '../assets/icons/upload_icon.svg'; // 업로드 아이콘의 실제 경로를 사용하세요
import '../styles/SignatureVerificationPage.css'; // 스타일 파일의 실제 경로를 사용하세요

const SignatureVerificationPage = () => {
  const navigate = useNavigate();
  const { completeAction } = useAuth();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      // 파일 업로드 로직 추가 (여기서는 간단히 alert로 대체)
      alert('본인서명사실확인서가 업로드되었습니다.');

      // signatureVerification 액션을 완료로 표시
      completeAction('signatureVerification');

      // 메인 화면으로 이동
      navigate('/');
    } else {
      alert('pdf 파일만 업로드 가능합니다.');
    }
  };

  return (
    <div className="signature-verification-page">
      <h1>본인서명사실확인서 페이지</h1>
      <label htmlFor="file-upload" className="file-upload-label">
        <img src={uploadIcon} alt="Upload Icon" />
        <input
          id="file-upload"
          type="file"
          accept=".png"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default SignatureVerificationPage;
