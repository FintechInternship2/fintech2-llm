import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/ObjectionStoragePage.css';
import previousRequestIcon from '../assets/icons/transfer_data.svg'; // 이전 내역 아이콘
import folderIcon from '../assets/icons/folder.svg';
import message2Icon from '../assets/icons/message2.svg'; //보관함 색 아이콘

const ObjectionStoragePage = () => {
  const navigate = useNavigate();
  const { completedActions, submitDocuments } = useAuth(); // Import the necessary functions

  const documents = [
    {
      name: '이의제기신청서',
      status: completedActions.objection ? 'completed' : 'notStarted', 
      route: '/edit-objection',
      id: '00100341',
      date: '2024-08-10',
    },
    {
      name: '신분증사본',
      status: completedActions.idCopy ? 'completed' : 'notStarted', 
      route: '/edit-id-copy',
      id: '00100341',
      date: '2024-08-10',
    },
    {
      name: '본인서명사실확인서',
      status: completedActions.signatureVerification ? 'completed' : 'notStarted', 
      route: '/edit-signature-verification',
      id: '00100341',
      date: '2024-08-10',
    },
    {
      name: '증빙자료',
      status: completedActions.additionalData ? 'completed' : 'notStarted', 
      route: '/edit-additional-data',
      id: '00100341',
      date: '2024-08-10',
    },
  ];
  
  const incompleteDocuments = documents.filter(doc => doc.status === 'notStarted');
  const inProgressDocuments = documents.filter(doc => doc.status === 'inProgress');
  const completedDocuments = documents.filter(doc => doc.status === 'completed');

  const allDocumentsCompleted = documents.every(doc => doc.status === 'completed');

  const handleSubmit = () => {
    if (allDocumentsCompleted) {
      alert("서류가 정상적으로 접수되었습니다!");
      submitDocuments(); // Call the submitDocuments function
      navigate('/previous-request');
    } else {
      alert("필수 서류를 제출해주세요");
    }
  };

  return (
    /**/
    <div className="objection-storage-page"> 
      <header className="osp-header">
        <h1 className="osp-title">보관함</h1>
        <div className="spacer"></div>
      </header>



      <div className="osp-status-header">
        <span className="osp-status-title">미작성 {incompleteDocuments.length}</span>
        <span className="osp-status-title">작성중 {inProgressDocuments.length}</span>
        <span className="osp-status-title">완료 {completedDocuments.length}</span>
      </div>


      <div className="osp-container">
        <section className="documents-section">
          <ul>
            {incompleteDocuments.map(doc => (
              <li key={doc.name} className="document-item not-started">
                <div className="document-info">
                  <span className="document-status">
                    <span className='doc-notyet'>미작성</span>
                    </span>
                  <span className="document-title">{doc.name}</span>
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
            {inProgressDocuments.map(doc => (
              <li key={doc.name} className="document-item in-progress">
                <div className="document-info">
                  <span className="document-status"><span className='doc-ing'>작성중</span></span>
                  <span className="document-title">{doc.name}</span>
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
            {completedDocuments.map(doc => (
              <li key={doc.name} className="document-item completed">
                <div className="document-info">
                  <span className="document-status"><span className='doc-done'>완료</span> 
                    <span className="document-date"> {doc.date}</span> 
                  </span>
                  <span className="document-title">{doc.name}
                   <span className="document-id">   서류 번호: {doc.id}</span>  
                  </span> 
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
          </ul>
        </section>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!allDocumentsCompleted}
>
          제출하기
        </button>
      </div>


      <div className="navigation-bar">
        <button onClick={() => navigate('/objection-data-storage')}>
          <img src={folderIcon} alt="보관함" />
          <span>보관함</span>
        </button>
        <button onClick={() => navigate('/')}>
          <img src={message2Icon} alt="채팅" />
          <span>채팅</span>
        </button>
        <button onClick={() => navigate('/previous-request')}>
          <img src={previousRequestIcon} alt="이전 내역" />
          <span>이전 내역</span>
        </button>
      </div>
    </div>
  );
};

export default ObjectionStoragePage;
