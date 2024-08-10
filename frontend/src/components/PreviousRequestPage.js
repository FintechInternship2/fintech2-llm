import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PreviousRequestPage.css';
import objectionDataStorageIcon from '../assets/icons/locker.svg'; // 보관함 아이콘
import message2Icon from '../assets/icons/message2.svg'; //보관함 색 아이콘
import previousIcon from '../assets/icons/previous.svg'; //보관함 색 아이콘

const PreviousRequestPage = () => {
  const navigate = useNavigate();

  const requests = [
    { status: '제출완료', date: '2024.08.10', details: '이의제기신청서 외 3건', id: '2024040101', submittedDate: '2024-08-08' }
    
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
        <h1 className="title">이전 내역</h1>
        <div className="spacer"></div>
      </header>

      <div className="status-header">
        <span className="status-item">제출완료 </span>
        <span className="status-item">확인중 </span>
        <span className="status-item">승인완료 </span>
        <span className="status-item">반려 </span>
        <span className="status-item">추가서류요청 </span>
      </div>


      <hr className="separator" />

      <div className="container">
        {requests.map((request, index) => (
          <div key={index} className="request-item">
            <div className="request-status">{request.status} · {request.date}</div>
            <div className="request-details">{request.details}</div>
            <div className="request-id">접수 번호: 00100341· 제출완료: 00100341</div>
          </div>
        ))}
      </div>


      <div className="navigation-bar">
        <button onClick={() => navigate('/objection-data-storage')}>
          <img src={objectionDataStorageIcon} alt="보관함" />
          <span>보관함</span>
        </button>
        <button onClick={() => navigate('/')}>
          <img src={message2Icon} alt="채팅" />
          <span>채팅</span>
        </button>
        <button onClick={() => navigate('/previous-request')}>
          <img src={previousIcon} alt="이전 내역" />
          <span>이전 내역</span>
        </button>
      </div>
    </div>
  );
};

export default PreviousRequestPage;