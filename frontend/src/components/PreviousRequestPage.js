import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PreviousRequestPage.css';
import GoBackIcon from '../assets/icons/goback_icon.svg'; // Import the custom icon

const PreviousRequestPage = () => {
  const navigate = useNavigate();

  const requests = [
    { status: '제출완료', date: '2024-08-08', details: '이의제기신청서 외 3건', id: '2024040101', submittedDate: '2024-08-08' }
    
  ];

  const statusCounts = {
    전체: requests.length,
    제출완료: requests.filter(r => r.status === '제출완료').length,
    확인중: requests.filter(r => r.status === '확인중').length,
    승인완료: requests.filter(r => r.status === '승인완료').length,
    반려: requests.filter(r => r.status === '반려').length,
    추가서류요청: requests.filter(r => r.status === '추가서류요청').length,
  };

  return (
    <div className="previous-request-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={GoBackIcon} alt="Go back" className="back-icon" />
        </button>
        <h1 className="title">이전 내역</h1>
        <div className="spacer"></div>
      </header>
      <div className="status-header">
        <span className="status-title">전체 {statusCounts.전체}</span>
      </div>
      <div className="status-subheader">
        <span className="status-item">제출완료 {statusCounts.제출완료}</span>
        <span className="status-item">확인중 {statusCounts.확인중}</span>
        <span className="status-item">승인완료 {statusCounts.승인완료}</span>
        <span className="status-item">반려 {statusCounts.반려}</span>
        <span className="status-item">추가서류요청 {statusCounts.추가서류요청}</span>
      </div>
      <hr className="separator" />
      <div className="container">
        {requests.map((request, index) => (
          <div key={index} className="request-item">
            <div className="request-status">{request.status} · {request.date}</div>
            <div className="request-details">{request.details}</div>
            <div className="request-id">접수 번호: {request.id} · 제출완료 {request.submittedDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousRequestPage;